<?php

declare(strict_types=1);

require_once __DIR__ . '/../_lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('POST');

$body = read_json_body();
$email = normalize_email((string)($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  send_json(400, ['error' => 'E-mail inválido']);
}

if (mb_strlen($password) < 8) {
  send_json(400, ['error' => 'Senha inválida']);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, email, password_hash, created_at FROM app_users WHERE email = :e LIMIT 1');
$stmt->execute([':e' => $email]);
$row = $stmt->fetch();

if (!$row || !password_verify($password, (string)$row['password_hash'])) {
  send_json(401, ['error' => 'Credenciais inválidas']);
}

create_session((string)$row['id']);

send_json(200, [
  'user' => [
    'id' => (string)$row['id'],
    'email' => (string)$row['email'],
    'created_at' => (string)$row['created_at'],
  ]
]);

