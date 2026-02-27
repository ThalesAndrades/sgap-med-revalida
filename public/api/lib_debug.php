<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib.php';

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);

