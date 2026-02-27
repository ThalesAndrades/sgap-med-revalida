<?php

declare(strict_types=1);

function send_json(int $code, array $payload): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}

function handle_cors(array $allowedOrigins): void {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
  }

  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

function require_method(string $method): void {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
    send_json(405, ['error' => 'Method not allowed']);
  }
}

function read_json_body(): array {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '', true);
  if (!is_array($data)) {
    send_json(400, ['error' => 'Invalid JSON']);
  }
  return $data;
}

function normalize_email(string $email): string {
  $email = trim(mb_strtolower($email));
  return $email;
}

function uuid_v4(): string {
  $bytes = random_bytes(16);
  $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
  $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
}

function now_iso(): string {
  return gmdate('c');
}

function load_app_config(): array {
  $path = __DIR__ . '/config.php';
  if (file_exists($path)) {
    $cfg = include $path;
    if (is_array($cfg)) return $cfg;
  }
  return [];
}

function allowed_origins_from_config(array $cfg): array {
  $origins = $cfg['allowed_origins'] ?? [];
  if (!is_array($origins)) $origins = [];
  $out = [];
  foreach ($origins as $o) {
    if (is_string($o) && $o !== '') $out[] = $o;
  }
  $out[] = 'https://revalidaai.med.br';
  $out[] = 'https://www.revalidaai.med.br';
  $out[] = 'http://localhost:5173';
  $out[] = 'http://localhost:4173';
  return array_values(array_unique($out));
}

function db(): PDO {
  static $pdo = null;
  if ($pdo instanceof PDO) return $pdo;

  $storageDir = __DIR__ . '/storage';
  if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
  }
  $dbPath = $storageDir . '/app.sqlite';
  $pdo = new PDO('sqlite:' . $dbPath, null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);

  $pdo->exec('PRAGMA journal_mode = WAL;');
  $pdo->exec('PRAGMA foreign_keys = ON;');

  $pdo->exec('CREATE TABLE IF NOT EXISTS whitelist_emails (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );');

  $pdo->exec('CREATE TABLE IF NOT EXISTS waitlist_signups (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT "landing",
    created_at TEXT NOT NULL
  );');

  $pdo->exec('CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );');

  $pdo->exec('CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );');

  return $pdo;
}

function session_cookie_name(): string {
  return 'revalidaai_session';
}

function read_session_token(): string {
  $name = session_cookie_name();
  return is_string($_COOKIE[$name] ?? null) ? (string)$_COOKIE[$name] : '';
}

function set_session_cookie(string $token, int $maxAgeSeconds): void {
  $params = [
    'expires' => time() + $maxAgeSeconds,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax',
  ];
  setcookie(session_cookie_name(), $token, $params);
}

function clear_session_cookie(): void {
  $params = [
    'expires' => time() - 3600,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax',
  ];
  setcookie(session_cookie_name(), '', $params);
}

function create_session(string $userId): string {
  $pdo = db();
  $token = bin2hex(random_bytes(32));
  $createdAt = now_iso();
  $expiresAt = gmdate('c', time() + 60 * 60 * 24 * 30);
  $stmt = $pdo->prepare('INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (:t, :u, :e, :c)');
  $stmt->execute([':t' => $token, ':u' => $userId, ':e' => $expiresAt, ':c' => $createdAt]);
  set_session_cookie($token, 60 * 60 * 24 * 30);
  return $token;
}

function get_current_user(): ?array {
  $token = read_session_token();
  if ($token === '') return null;
  $pdo = db();
  $stmt = $pdo->prepare('SELECT user_id, expires_at FROM sessions WHERE token = :t');
  $stmt->execute([':t' => $token]);
  $row = $stmt->fetch();
  if (!$row) return null;
  if (strtotime((string)$row['expires_at']) <= time()) {
    $pdo->prepare('DELETE FROM sessions WHERE token = :t')->execute([':t' => $token]);
    return null;
  }
  $userId = (string)$row['user_id'];
  $u = $pdo->prepare('SELECT id, email, created_at FROM app_users WHERE id = :id');
  $u->execute([':id' => $userId]);
  $user = $u->fetch();
  if (!$user) return null;
  return [
    'id' => (string)$user['id'],
    'email' => (string)$user['email'],
    'created_at' => (string)$user['created_at'],
  ];
}

function is_email_whitelisted(string $email): bool {
  $pdo = db();
  $stmt = $pdo->prepare('SELECT active FROM whitelist_emails WHERE email = :e LIMIT 1');
  $stmt->execute([':e' => $email]);
  $row = $stmt->fetch();
  if (!$row) return false;
  return (int)$row['active'] === 1;
}
