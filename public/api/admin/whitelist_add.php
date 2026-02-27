<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('POST');

$token = (string)($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '');
$expected = (string)($cfg['admin_token'] ?? '');

if ($expected === '' || !hash_equals($expected, $token)) {
  send_json(403, ['error' => 'Forbidden']);
}

$body = read_json_body();
$email = normalize_email((string)($body['email'] ?? ''));
$active = (int)($body['active'] ?? 1);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  send_json(400, ['error' => 'E-mail inválido']);
}

$pdo = db();

$stmt = $pdo->prepare('SELECT id FROM whitelist_emails WHERE email = :e LIMIT 1');
$stmt->execute([':e' => $email]);
$row = $stmt->fetch();

if ($row) {
  $u = $pdo->prepare('UPDATE whitelist_emails SET active = :a, updated_at = :u WHERE email = :e');
  $u->execute([':a' => $active ? 1 : 0, ':u' => now_iso(), ':e' => $email]);
  send_json(200, ['ok' => true]);
}

$i = $pdo->prepare('INSERT INTO whitelist_emails (id, email, active, created_at, updated_at) VALUES (:id, :e, :a, :c, :u)');
$i->execute([
  ':id' => uuid_v4(),
  ':e' => $email,
  ':a' => $active ? 1 : 0,
  ':c' => now_iso(),
  ':u' => now_iso(),
]);

send_json(200, ['ok' => true]);
