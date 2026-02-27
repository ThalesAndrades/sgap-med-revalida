export type LLMMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type LLMProxyResponse = {
  content: string;
  provider?: string;
  model?: string;
};

export type LLMProxyRequest = {
  messages: LLMMessage[];
  response_format?: 'text' | 'json';
  mode?: 'auto' | 'free';
  model?: string;
};

export async function callLLMProxy(request: LLMProxyRequest): Promise<LLMProxyResponse> {
  const response = await fetch('/api/llm.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `LLM proxy error (${response.status})`);
  }

  return response.json();
}

