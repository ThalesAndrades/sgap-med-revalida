<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('POST');

$body = read_json_body();
$email = normalize_email((string)($body['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  send_json(400, ['error' => 'E-mail inválido']);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, email FROM app_users WHERE email = :e LIMIT 1');
$stmt->execute([':e' => $email]);
$row = $stmt->fetch();

if (!$row) {
  send_json(200, ['ok' => true]);
}

$token = create_password_reset((string)$row['id']);
$resetUrl = app_base_url_from_request() . '/login?reset=' . rawurlencode($token);

if (!send_password_reset_email((string)$row['email'], $resetUrl)) {
  send_json(500, ['error' => 'Não foi possível enviar o e-mail agora. Tente novamente.']);
}

send_json(200, ['ok' => true]);

