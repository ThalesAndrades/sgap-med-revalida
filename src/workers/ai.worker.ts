import { pipeline, env } from '@xenova/transformers';

// Skip local model checks
env.allowLocalModels = false;

// Singleton pattern for the classifier
class MedicalIntentClassifier {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: any = null;

  static async getInstance(progress_callback: Function | null = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { 
        progress_callback 
      });
    }
    return this.instance;
  }
}

// Define our intents and some example phrases for each
const INTENT_EXAMPLES = {
  'HAND_WASH': [
    'lavar as mãos', 'higienizar mãos', 'passar álcool', 'fazer assepsia', 'limpar as mãos', 'biossegurança', 'procedimento de higiene'
  ],
  'PHYSICAL_EXAM': [
    'fazer exame físico', 'examinar o paciente', 'ausculta cardíaca', 'palpação abdominal', 'inspeção geral', 'verificar o tórax', 'auscultar pulmão'
  ],
  'VITAL_SIGNS': [
    'verificar sinais vitais', 'medir pressão', 'qual a frequência cardíaca', 'saturação de oxigênio', 'temperatura', 'dados vitais', 'monitorização'
  ],
  'DIAGNOSIS': [
    'meu diagnóstico é', 'hipótese diagnóstica', 'suspeita clínica', 'eu acho que é', 'quadro compatível com', 'conclusão diagnóstica'
  ],
  'MEDICATION': [
    'prescrever medicação', 'administrar remédio', 'fazer dipirona', 'iniciar antibiótico', 'dar oxigênio', 'medicamento', 'tratamento medicamentoso'
  ],
  'EXAMS': [
    'solicitar exames', 'pedir raio x', 'fazer tomografia', 'exames laboratoriais', 'hemograma completo', 'eletrocardiograma', 'exames complementares'
  ],
  'DISCHARGE': [
    'dar alta', 'liberar paciente', 'encaminhar para casa', 'receita médica', 'orientações de alta', 'finalizar atendimento'
  ]
};

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Pre-compute embeddings for examples (in a real app, these would be pre-computed and stored)
let intentEmbeddings: Record<string, number[][]> = {};

self.addEventListener('message', async (event) => {
  const { type, text } = event.data;

  if (type === 'init') {
    try {
      // Initialize model
      const extractor = await MedicalIntentClassifier.getInstance((data: any) => {
        self.postMessage({ status: 'downloading', data });
      });

      // Compute embeddings for examples if not already done
      if (Object.keys(intentEmbeddings).length === 0) {
        self.postMessage({ status: 'initializing_embeddings' });
        
        for (const [intent, examples] of Object.entries(INTENT_EXAMPLES)) {
          intentEmbeddings[intent] = [];
          for (const example of examples) {
            const output = await extractor(example, { pooling: 'mean', normalize: true });
            intentEmbeddings[intent].push(Array.from(output.data));
          }
        }
      }

      self.postMessage({ status: 'ready' });
    } catch (error) {
      console.error(error);
      self.postMessage({ status: 'error', error: error });
    }
  } else if (type === 'classify') {
    try {
      const extractor = await MedicalIntentClassifier.getInstance();
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      const inputEmbedding = Array.from(output.data) as number[];

      let bestIntent = 'UNKNOWN';
      let maxScore = -1;

      // Compare input against all examples
      for (const [intent, embeddings] of Object.entries(intentEmbeddings)) {
        for (const embedding of embeddings) {
          const score = cosineSimilarity(inputEmbedding, embedding);
          if (score > maxScore) {
            maxScore = score;
            bestIntent = intent;
          }
        }
      }

      // Threshold for confidence
      if (maxScore < 0.35) { // Strict threshold
        bestIntent = 'UNKNOWN';
      }

      self.postMessage({ status: 'result', intent: bestIntent, confidence: maxScore });
    } catch (error) {
      self.postMessage({ status: 'error', error: error });
    }
  }
});
