import OpenAI from 'openai';
import { Case, SimulationFeedback } from '../../types';

// Initialize OpenAI client
// Note: In a real production app, this should be done in a backend proxy to hide the key.
// For this prototype/local tool, we use the client-side approach with the key provided by the environment.
// Ideally, use `import.meta.env.VITE_OPENAI_API_KEY`
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'sk-proj-****************************************************************', // Masked fallback
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export const generateCaseWithAI = async (specialty: string, difficulty: string): Promise<Case> => {
  try {
    const prompt = `
      Crie um caso clínico detalhado para treinamento de médicos (Exame Revalida INEP) com as seguintes características:
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
      
      O caso deve ser realista, desafiador e seguir os protocolos do Ministério da Saúde do Brasil.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content generated");

    const data = JSON.parse(content);

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No feedback generated");

    // Handle potential wrapper object in response
    const parsed = JSON.parse(content);
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || "Não foi possível gerar a explicação.";
  } catch (error) {
    console.error("Error explaining topic:", error);
    return "Erro ao conectar com o tutor IA. Verifique sua conexão.";
  }
};
