import { KnowledgeTopic } from '../../types';

export const externalTopics: KnowledgeTopic[] = [
  // --- ENDOCRINOLOGIA (Medscape Source) ---
  {
    id: 'ext-endo-001',
    title: 'Crise Tireotóxica',
    category: 'Endocrinologia',
    tags: ['Tireoide', 'Burch-Wartofsky', 'Emergência'],
    summary: 'Manejo da tempestade tireoidiana.',
    content_type: 'protocol',
    content: { steps: ['Bloqueador Beta (Propranolol)', 'Antitireoidiano (PTU/Metimazol)', 'Iodo Inorgânico (Lugol) após 1h', 'Corticoide (Hidrocortisona)'] },
    references: ['ATA Guidelines 2016']
  },
  
  // --- PSIQUIATRIA (DSM-5 Source) ---
  {
    id: 'ext-psiq-001',
    title: 'Esquizofrenia: Critérios Diagnósticos',
    category: 'Psiquiatria',
    tags: ['Psicose', 'DSM-5', 'Alucinação'],
    summary: 'Sintomas positivos e negativos por > 6 meses.',
    content_type: 'concept',
    content: { explanation: 'Pelo menos 2: Delírios, Alucinações, Discurso desorganizado, Comportamento desorganizado, Sintomas negativos. Impacto funcional obrigatório.' },
    references: ['DSM-5-TR']
  },

  // --- DERMATOLOGIA (SBD Source) ---
  {
    id: 'ext-derm-001',
    title: 'Carcinoma Basocelular',
    category: 'Dermatologia',
    tags: ['Câncer de Pele', 'CBC', 'Biopsia'],
    summary: 'Tumor maligno mais comum.',
    content_type: 'concept',
    content: { explanation: 'Pápula perlácea com telangiectasias. Crescimento lento. Metástase rara. Tratamento: Exérese cirúrgica com margem.' },
    references: ['SBD Consenso']
  },

  // --- ORTOPEDIA (SBOT Source) ---
  {
    id: 'ext-orto-001',
    title: 'Fratura de Fêmur Proximal',
    category: 'Ortopedia',
    tags: ['Idoso', 'Queda', 'Cirurgia'],
    summary: 'Classificação e tratamento em idosos.',
    content_type: 'flowchart',
    content: { steps: ['Colo do Fêmur (Intracapsular) -> Artroplastia (Idoso)', 'Intertrocantérica (Extracapsular) -> Fixação (DHS/PFN)'] },
    references: ['SBOT Diretrizes']
  }
];
