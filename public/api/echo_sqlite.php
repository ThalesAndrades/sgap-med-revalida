<?php

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['value' => 'sqlite:'], JSON_UNESCAPED_UNICODE);

