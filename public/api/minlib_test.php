<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/minlib.php';

echo json_encode(['ok' => minlib_ok()], JSON_UNESCAPED_UNICODE);

