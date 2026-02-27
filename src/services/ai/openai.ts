import { Case, SimulationFeedback } from '../../types';
import { callLLMProxy, LLMMessage } from './llmProxy';

let openAIFallbackClient: any | null = null;

async function callOpenAIFallback(messages: LLMMessage[], wantJsonObject: boolean): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('No OpenAI key configured for fallback');
  }

  if (!openAIFallbackClient) {
    const mod: any = await import('openai');
    const OpenAI = mod.default;
    openAIFallbackClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  const body: any = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7
  };

  if (wantJsonObject) {
    body.response_format = { type: 'json_object' };
  }

  const response = await openAIFallbackClient.chat.completions.create(body);
  return response.choices?.[0]?.message?.content || '';
}

const safeJsonParse = (value: string): any => {
  const trimmed = value.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    const aStart = trimmed.indexOf('[');
    const aEnd = trimmed.lastIndexOf(']');
    if (aStart !== -1 && aEnd !== -1 && aEnd > aStart) {
      return JSON.parse(trimmed.slice(aStart, aEnd + 1));
    }
    throw new Error('Invalid JSON from LLM');
  }
};

export const generateCaseWithAI = async (specialty: string, difficulty: string): Promise<Case> => {
  try {
    const prompt = `Crie um caso clínico detalhado para treinamento de médicos (Exame Revalida INEP) com as seguintes características:
- Especialidade: ${specialty}
- Dificuldade: ${difficulty}
- Formato: JSON estrito.

Estrutura do JSON:
{
  "title": "Título criativo do caso",
  "description": "Descrição do cenário inicial (paciente chegando, queixa principal, sinais vitais iniciais)",
  "expected_diagnosis": ["Diagnóstico Principal", "Diagnóstico Diferencial"],
  "expected_conduct": ["Passo 1", "Passo 2", "Passo 3", "Passo 4"]
}

O caso deve ser realista, desafiador e seguir os protocolos do Ministério da Saúde do Brasil.`;

    const messages: LLMMessage[] = [{ role: 'user', content: prompt }];
    let content = '';
    try {
      const res = await callLLMProxy({
        messages,
        response_format: 'json',
        mode: 'free'
      });
      content = res.content;
    } catch {
      content = await callOpenAIFallback(messages, true);
    }

    if (!content) throw new Error('No content generated');

    const data = safeJsonParse(content);

    return {
      id: `ai-gen-${Date.now()}`,
      title: data.title,
      specialty: specialty,
      difficulty: difficulty as 'basic' | 'intermediate' | 'advanced',
      description: data.description,
      expected_diagnosis: data.expected_diagnosis,
      expected_conduct: data.expected_conduct,
      time_limit: 10,
      is_active: true
    };

  } catch (error) {
    console.error("Error generating case:", error);
    throw error;
  }
};

export const generateFeedbackWithAI = async (
  caseData: Case, 
  transcript: { role: string, text: string }[]
): Promise<SimulationFeedback[]> => {
  try {
    const dialogueText = transcript.map(t => `${t.role.toUpperCase()}: ${t.text}`).join('\n');
    
    const prompt = `
      Atue como um examinador sênior do Revalida INEP. Analise a transcrição abaixo de uma estação prática de ${caseData.specialty}.
      
      Caso Clínico:
      ${caseData.description}
      Diagnóstico Esperado: ${caseData.expected_diagnosis.join(', ')}
      Conduta Esperada: ${caseData.expected_conduct.join(', ')}
      
      Transcrição da Simulação:
      ${dialogueText}
      
      Gere um feedback estruturado em JSON com 5 a 7 critérios de avaliação baseados no desempenho do candidato.
      Para cada critério, indique se foi atingido (true/false), uma nota do examinador e pontuação (0.0 a 2.0).
      
      Estrutura JSON:
      [
        { "criterion": "Critério avaliado", "achieved": boolean, "examiner_note": "Comentário justificando", "points": number }
      ]
    `;

    const messages: LLMMessage[] = [{ role: 'user', content: prompt }];
    let content = '';
    try {
      const res = await callLLMProxy({
        messages,
        response_format: 'text',
        mode: 'free'
      });
      content = res.content;
    } catch {
      content = await callOpenAIFallback(messages, false);
    }

    if (!content) throw new Error('No feedback generated');

    const parsed = safeJsonParse(content);
    return Array.isArray(parsed) ? parsed : parsed.feedback || parsed.criteria || [];

  } catch (error) {
    console.error("Error generating feedback:", error);
    // Fallback to static feedback if AI fails
    return [
      { criterion: "Análise por IA Indisponível", achieved: false, examiner_note: "Erro ao conectar com servidor de correção.", points: 0 }
    ];
  }
};

export const explainTopicWithAI = async (topicTitle: string, context: string): Promise<string> => {
  try {
    const prompt = `
      Você é um tutor médico especialista em preparação para o Revalida.
      Explique de forma didática e resumida o seguinte tópico: "${topicTitle}".
      Use o contexto abaixo como base, mas expanda com informações relevantes de diretrizes atuais (SBC, MS, etc).
      Contexto: ${context}
      
      A explicação deve ser focada em "o que cai na prova" e "pegadinhas comuns".
      Use formatação Markdown para deixar o texto legível (negrito, tópicos).
    `;

    const messages: LLMMessage[] = [{ role: 'user', content: prompt }];
    try {
      const { content } = await callLLMProxy({
        messages,
        response_format: 'text',
        mode: 'free'
      });
      return content || 'Não foi possível gerar a explicação.';
    } catch {
      const content = await callOpenAIFallback(messages, false);
      return content || 'Não foi possível gerar a explicação.';
    }
  } catch (error) {
    console.error("Error explaining topic:", error);
    return "Erro ao conectar com o tutor IA. Verifique sua conexão.";
  }
};
