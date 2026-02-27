<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);

if (!is_array($payload)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

$messages = $payload['messages'] ?? null;
$responseFormat = $payload['response_format'] ?? 'text';
$mode = $payload['mode'] ?? 'auto';
$model = $payload['model'] ?? null;

if (!is_array($messages) || count($messages) < 1) {
  http_response_code(400);
  echo json_encode(['error' => 'messages is required']);
  exit;
}

foreach ($messages as $m) {
  if (!is_array($m) || !is_string($m['role'] ?? null) || !is_string($m['content'] ?? null)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid messages format']);
    exit;
  }
}

function http_post_json(string $url, array $headers, array $body): array {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge([
    'Content-Type: application/json',
    'Accept: application/json'
  ], $headers));
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
  curl_setopt($ch, CURLOPT_TIMEOUT, 60);

  $resp = curl_exec($ch);
  $err = curl_error($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($resp === false) {
    return ['ok' => false, 'status' => 0, 'error' => $err ?: 'Network error'];
  }

  $data = json_decode($resp, true);
  if (!is_array($data)) {
    return ['ok' => false, 'status' => $status, 'error' => 'Invalid upstream response'];
  }

  if ($status < 200 || $status >= 300) {
    return ['ok' => false, 'status' => $status, 'error' => $data['error']['message'] ?? $data['message'] ?? 'Upstream error'];
  }

  return ['ok' => true, 'status' => $status, 'data' => $data];
}

function load_config(): array {
  $configPath = __DIR__ . '/config.php';
  if (file_exists($configPath)) {
    $cfg = include $configPath;
    if (is_array($cfg)) return $cfg;
  }
  return [];
}

$cfg = load_config();

$openaiKey = (string)($cfg['openai_api_key'] ?? '');
$openrouterKey = (string)($cfg['openrouter_api_key'] ?? '');
$openrouterSiteUrl = (string)($cfg['openrouter_site_url'] ?? '');
$geminiKey = (string)($cfg['gemini_api_key'] ?? '');

function pick_provider(string $mode, string $openrouterKey, string $geminiKey, string $openaiKey): string {
  $mode = strtolower($mode);
  if ($mode === 'free') {
    if ($openrouterKey !== '') return 'openrouter';
    if ($geminiKey !== '') return 'gemini';
    if ($openaiKey !== '') return 'openai';
    return 'none';
  }

  if ($openrouterKey !== '') return 'openrouter';
  if ($geminiKey !== '') return 'gemini';
  if ($openaiKey !== '') return 'openai';
  return 'none';
}

$provider = pick_provider((string)$mode, $openrouterKey, $geminiKey, $openaiKey);

if ($provider === 'none') {
  http_response_code(503);
  echo json_encode([
    'error' => 'No LLM provider configured on server',
    'hint' => 'Configure API keys (OpenRouter or Gemini recommended for free tier)'
  ]);
  exit;
}

$wantJson = ($responseFormat === 'json');

try {
  if ($provider === 'openrouter') {
    $finalModel = is_string($model) && $model !== '' ? $model : 'google/gemma-2-9b-it:free';

    $headers = [
      'Authorization: Bearer ' . $openrouterKey,
    ];

    if ($openrouterSiteUrl !== '') {
      $headers[] = 'HTTP-Referer: ' . $openrouterSiteUrl;
      $headers[] = 'X-Title: Revalida AI';
    }

    $systemJsonGuard = $wantJson ? [
      [
        'role' => 'system',
        'content' => 'Responda APENAS com um JSON válido. Não use markdown, não use texto fora do JSON.'
      ]
    ] : [];

    $upstream = http_post_json('https://openrouter.ai/api/v1/chat/completions', $headers, [
      'model' => $finalModel,
      'messages' => array_merge($systemJsonGuard, $messages),
      'temperature' => 0.7,
    ]);

    if (!$upstream['ok']) {
      http_response_code(502);
      echo json_encode(['error' => $upstream['error'], 'provider' => 'openrouter']);
      exit;
    }

    $content = (string)($upstream['data']['choices'][0]['message']['content'] ?? '');
    echo json_encode(['content' => $content, 'provider' => 'openrouter', 'model' => $finalModel]);
    exit;
  }

  if ($provider === 'gemini') {
    $finalModel = is_string($model) && $model !== '' ? $model : 'gemini-1.5-flash';
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($finalModel) . ':generateContent?key=' . rawurlencode($geminiKey);

    $parts = [];
    foreach ($messages as $m) {
      $role = $m['role'];
      $prefix = ($role === 'system') ? '[SISTEMA] ' : (($role === 'assistant') ? '[ASSISTENTE] ' : '[USUÁRIO] ');
      $parts[] = ['text' => $prefix . $m['content']];
    }

    if ($wantJson) {
      $parts[] = ['text' => 'Responda APENAS com um JSON válido. Não use markdown, não use texto fora do JSON.'];
    }

    $upstream = http_post_json($url, [], [
      'contents' => [
        [
          'role' => 'user',
          'parts' => $parts
        ]
      ],
      'generationConfig' => [
        'temperature' => 0.7,
      ]
    ]);

    if (!$upstream['ok']) {
      http_response_code(502);
      echo json_encode(['error' => $upstream['error'], 'provider' => 'gemini']);
      exit;
    }

    $content = (string)($upstream['data']['candidates'][0]['content']['parts'][0]['text'] ?? '');
    echo json_encode(['content' => $content, 'provider' => 'gemini', 'model' => $finalModel]);
    exit;
  }

  $finalModel = is_string($model) && $model !== '' ? $model : 'gpt-4o-mini';
  $headers = ['Authorization: Bearer ' . $openaiKey];

  $body = [
    'model' => $finalModel,
    'messages' => $messages,
    'temperature' => 0.7,
  ];

  if ($wantJson) {
    $body['response_format'] = ['type' => 'json_object'];
  }

  $upstream = http_post_json('https://api.openai.com/v1/chat/completions', $headers, $body);

  if (!$upstream['ok']) {
    http_response_code(502);
    echo json_encode(['error' => $upstream['error'], 'provider' => 'openai']);
    exit;
  }

  $content = (string)($upstream['data']['choices'][0]['message']['content'] ?? '');
  echo json_encode(['content' => $content, 'provider' => 'openai', 'model' => $finalModel]);
  exit;
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Internal error']);
  exit;
}

