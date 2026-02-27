<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('POST');

$body = read_json_body();
$email = normalize_email((string)($body['email'] ?? ''));
$source = trim((string)($body['source'] ?? 'landing'));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  send_json(400, ['error' => 'E-mail inválido']);
}

if ($source === '') $source = 'landing';

$pdo = db();
$stmt = $pdo->prepare('INSERT INTO waitlist_signups (id, email, source, created_at) VALUES (:id, :e, :s, :c)');
$stmt->execute([
  ':id' => uuid_v4(),
  ':e' => $email,
  ':s' => $source,
  ':c' => now_iso(),
]);

send_json(200, ['ok' => true]);
