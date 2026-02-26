# SGAP-MED Revalida Trainer

## Visão Geral
Plataforma de treinamento de alta performance para a 2ª fase do Exame Revalida INEP, focada em rigor institucional e precisão clínica. O sistema oferece simulações realistas de estações práticas com cronômetro, feedback imediato e ambiente controlado.

---

## 🧠 Arquitetura de Inteligência Artificial

Atualmente, o SGAP-MED utiliza uma abordagem de **IA Simbólica e Heurística** para garantir previsibilidade, controle e rigor técnico, essenciais para um exame padronizado como o Revalida.

### 1. Processamento de Voz (Speech-to-Text & Text-to-Speech)
O sistema utiliza a **Web Speech API** nativa dos navegadores modernos para interação bidirecional:
- **Entrada (STT):** Transcreve os comandos de voz do candidato em tempo real.
- **Saída (TTS):** Sintetiza a resposta do examinador/ator, permitindo que o candidato ouça as réplicas sem precisar ler, aumentando a imersão.

### 2. Motor de Decisão (Rule-Based System)
A "inteligência" do examinador virtual é baseada em um sistema robusto de regras e correspondência de padrões (Pattern Matching):
- **Desbloqueio de Achados:** O sistema analisa a transcrição do usuário em busca de palavras-chave médicas específicas (ex: "ausculta", "pulso", "saturação").
- **Lógica Sequencial:** Certos dados (como resultados de exames complementares) só são liberados se o candidato tiver realizado etapas prévias obrigatórias (ex: exame físico), mimetizando o fluxo real da prova.
- **Feedback Determinístico:** As respostas são padronizadas conforme o gabarito do caso clínico, evitando alucinações comuns em modelos generativos e garantindo que o feedback esteja 100% alinhado com o PCDT/INEP.

---

## 🚀 Roadmap de Evolução da IA

Para futuras versões, está planejada a migração para uma arquitetura híbrida, incorporando LLMs (Large Language Models) para maior fluidez, mantendo o rigor técnico.

### Fase 1: Processamento de Linguagem Natural (NLP) Avançado
- **Objetivo:** Melhorar a compreensão de intenção do usuário além de palavras-chave simples.
- **Tecnologia:** Integração com OpenAI API (GPT-4o) ou Anthropic (Claude 3.5 Sonnet).
- **Funcionalidade:** Permitir que o candidato peça o mesmo exame de formas variadas (ex: "Gostaria de ver o ritmo cardíaco" vs "Solicito ECG") com precisão semântica.

### Fase 2: Ator Virtual Dinâmico (Persona)
- **Objetivo:** Criar pacientes com personalidades e respostas emocionais variáveis.
- **Funcionalidade:** O "paciente" poderá demonstrar dor, ansiedade ou confusão mental dependendo da abordagem do médico (empatia vs frieza), impactando a nota de "Comunicação e Interação".

### Fase 3: Feedback Personalizado Gerativo
- **Objetivo:** Análise qualitativa detalhada do desempenho.
- **Funcionalidade:** Além do checklist binário, a IA gerará um relatório explicativo sobre *por que* o candidato errou, sugerindo leituras específicas baseadas nas lacunas de conhecimento identificadas.

---

## Stack Tecnológico Atual
- **Frontend:** React, TailwindCSS, Lucide Icons
- **Estado:** Zustand
- **Roteamento:** React Router
- **Voz:** Web Speech API
- **Dados:** Mock Local (Dexie-like structure)

## Como Executar
1. Clone o repositório.
2. `npm install`
3. `npm run dev`
4. Acesse via Chrome ou Edge (necessários para suporte total à Web Speech API).
