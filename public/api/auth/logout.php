<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib.php';

$cfg = load_app_config();
handle_cors(allowed_origins_from_config($cfg));
require_method('POST');

$pdo = db();
$token = read_session_token();
if ($token !== '') {
  $pdo->prepare('DELETE FROM sessions WHERE token = :t')->execute([':t' => $token]);
}
clear_session_cookie();
send_json(200, ['ok' => true]);
