<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('GET');

$user = get_current_user();
if (!$user) {
  send_json(200, ['user' => null]);
}

$email = normalize_email((string)$user['email']);
if (!is_email_whitelisted($email)) {
  send_json(200, ['user' => null]);
}

send_json(200, ['user' => $user]);
