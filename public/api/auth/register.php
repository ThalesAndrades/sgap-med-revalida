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

if ((function_exists('mb_strlen') ? mb_strlen($password) : strlen($password)) < 8) {
  send_json(400, ['error' => 'A senha precisa ter pelo menos 8 caracteres']);
}

if (!is_email_whitelisted($email)) {
  send_json(403, ['error' => 'Este e-mail ainda não está autorizado para o beta']);
}

$pdo = db();
$id = uuid_v4();
$createdAt = now_iso();
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
  $stmt = $pdo->prepare('INSERT INTO app_users (id, email, password_hash, created_at) VALUES (:id, :e, :p, :c)');
  $stmt->execute([':id' => $id, ':e' => $email, ':p' => $hash, ':c' => $createdAt]);
} catch (Throwable $e) {
  send_json(409, ['error' => 'Já existe uma conta com este e-mail']);
}

create_session($id);

send_json(200, [
  'user' => [
    'id' => $id,
    'email' => $email,
    'created_at' => $createdAt,
  ]
]);
