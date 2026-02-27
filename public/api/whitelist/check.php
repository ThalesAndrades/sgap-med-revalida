<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('POST');

$body = read_json_body();
$email = normalize_email((string)($body['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  send_json(200, ['allowed' => false]);
}

send_json(200, ['allowed' => is_email_whitelisted($email)]);
