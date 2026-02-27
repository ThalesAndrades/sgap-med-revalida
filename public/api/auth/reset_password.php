<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('POST');

$body = read_json_body();
$token = (string)($body['token'] ?? '');
$password = (string)($body['password'] ?? '');

if ((function_exists('mb_strlen') ? mb_strlen($password) : strlen($password)) < 8) {
  send_json(400, ['error' => 'A senha precisa ter pelo menos 8 caracteres']);
}

$userId = consume_password_reset($token);
if (!$userId) {
  send_json(400, ['error' => 'Link inválido ou expirado']);
}

$pdo = db();
$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare('UPDATE app_users SET password_hash = :p WHERE id = :id')->execute([':p' => $hash, ':id' => $userId]);
$pdo->prepare('DELETE FROM sessions WHERE user_id = :id')->execute([':id' => $userId]);

create_session($userId);

$u = $pdo->prepare('SELECT id, email, created_at FROM app_users WHERE id = :id');
$u->execute([':id' => $userId]);
$user = $u->fetch();
if (!$user) {
  send_json(500, ['error' => 'Não foi possível carregar o usuário']);
}

$email = normalize_email((string)$user['email']);
if (!is_email_whitelisted($email)) {
  clear_session_cookie();
  send_json(403, ['error' => 'Seu acesso foi revogado. Fale com o suporte para liberar novamente.']);
}

send_json(200, [
  'user' => [
    'id' => (string)$user['id'],
    'email' => (string)$user['email'],
    'created_at' => (string)$user['created_at'],
  ]
]);

