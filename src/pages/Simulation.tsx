import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '../hooks/useVoice';
import { useAIClassifier } from '../hooks/useAIClassifier';
import { mockDB } from '../services/mock/db';
import { generateCaseWithAI, generateFeedbackWithAI } from '../services/ai/openai';
import { Case, Finding, Simulation as SimType, SimulationFeedback } from '../types';
import { Mic, MicOff, Volume2, Timer, AlertOctagon, CheckSquare, XSquare, Play, DoorOpen, Activity, BrainCircuit, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Simulation = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [activeSimulation, setActiveSimulation] = useState<SimType | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [readingTimeLeft, setReadingTimeLeft] = useState(120); // 2 minutes reading time
  const [phase, setPhase] = useState<'selection' | 'reading' | 'simulation' | 'feedback'>('selection');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [dialogueHistory, setDialogueHistory] = useState<{role: 'doctor' | 'examiner', text: string}[]>([]);
  const [finalFeedback, setFinalFeedback] = useState<SimulationFeedback[]>([]);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [genParams, setGenParams] = useState({ specialty: 'Clínica Médica', difficulty: 'intermediate' });
  
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, supported, cancelSpeech } = useVoice({
    onTranscript: (text) => handleUserVoiceInput(text)
  });

  const { status: aiStatus, classify } = useAIClassifier();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCases = async () => {
      const data = await mockDB.getCases();
      setCases(data);
    };
    loadCases();
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (phase === 'reading' && readingTimeLeft > 0) {
      interval = setInterval(() => {
        setReadingTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'reading' && readingTimeLeft === 0) {
      handleStartCase();
    } else if (phase === 'simulation' && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (timeLeft <= 60 && timeLeft % 10 === 0) {
           // Play beep sound logic here if needed
        }
      }, 1000);
    } else if (phase === 'simulation' && timeLeft === 0) {
      handleFinishSimulation();
    }
    
    return () => clearInterval(interval);
  }, [phase, isTimerRunning, timeLeft, readingTimeLeft]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dialogueHistory]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectCase = (c: Case) => {
    setSelectedCase(c);
    setPhase('reading');
    setReadingTimeLeft(120); // 2 min reading
  };

  const handleGenerateCase = () => {
    setShowGenModal(true);
  };

  const confirmGenerateCase = async () => {
    setShowGenModal(false);
    setIsGeneratingCase(true);
    try {
      const newCase = await generateCaseWithAI(genParams.specialty, genParams.difficulty);
      setCases(prev => [newCase, ...prev]);
      handleSelectCase(newCase);
    } catch (error) {
      alert('Erro ao gerar caso com IA. Verifique sua chave de API.');
    } finally {
      setIsGeneratingCase(false);
    }
  };

  const handleStartCase = async () => {
    if (!user || !selectedCase) return;
    
    setPhase('simulation');
    const sim = await mockDB.createSimulation(user.id, selectedCase.id);
    setActiveSimulation(sim);
    setIsTimerRunning(true);
    setTimeLeft(600);
    
    const introText = "Você entrou na sala. O tempo de 10 minutos começou a contar. O paciente e o examinador aguardam sua abordagem.";
    setDialogueHistory([{ role: 'examiner', text: introText }]);
    speak(introText);
  };

  const handleFinishSimulation = async () => {
    setIsTimerRunning(false);
    cancelSpeech();
    setIsAnalyzingFeedback(true);
    
    if (activeSimulation && selectedCase) {
      // Use AI for dynamic feedback
      const feedback = await generateFeedbackWithAI(selectedCase, dialogueHistory);
      const score = feedback.reduce((acc, item) => acc + (item.achieved ? item.points : 0), 0);
      
      await mockDB.updateSimulation(activeSimulation.id, {
        end_time: new Date().toISOString(),
        status: 'completed',
        score: Math.min(100, score * 10), // Scale to 100, cap at 100
        feedback: feedback
      });
      
      setFinalFeedback(feedback);
      setIsAnalyzingFeedback(false);
      setPhase('feedback');
    }
  };

  const handleUserVoiceInput = async (text: string) => {
    setDialogueHistory(prev => [...prev, { role: 'doctor', text }]);
    setProcessingVoice(true);
    
    // AI Classification
    const { intent, confidence } = await classify(text);
    console.log(`AI Classified Intent: ${intent} (${Math.round(confidence * 100)}%)`);

    let response = "Não compreendi. Seja mais claro.";
    
    if (confidence > 0.35) {
      switch(intent) {
        case 'HAND_WASH':
          response = "Mãos lavadas. Pode prosseguir.";
          break;
        case 'PHYSICAL_EXAM':
          response = "Autorizado. Quais dados específicos você busca no exame físico?";
          break;
        case 'VITAL_SIGNS':
          response = "Cartão com sinais vitais entregue. (Verifique mentalmente os dados)";
          break;
        case 'DIAGNOSIS':
          response = "Ciente da hipótese. Qual a conduta terapêutica?";
          break;
        case 'MEDICATION':
          response = "Medicação anotada. Algo mais?";
          break;
        case 'EXAMS':
          response = "Exames solicitados. Aguarde os resultados.";
          break;
        case 'DISCHARGE':
          response = "Paciente orientado e liberado. Estação encerrada?";
          break;
        case 'REASSESSMENT':
          response = "Paciente reavaliado. Mantém quadro estável.";
          break;
      }
    } else {
        // Fallback for low confidence
        if (text.toLowerCase().includes('dor')) {
             response = "Paciente refere dor intensa.";
        } else {
             response = "Ciente. Prossiga.";
        }
    }
    
    setProcessingVoice(false);
    setDialogueHistory(prev => [...prev, { role: 'examiner', text: response }]);
    speak(response);
  };

  // --- RENDERERS ---

  if (phase === 'selection') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-inep-primary">Simulação Real (Modo Prova)</h1>
          <div className="flex items-center space-x-3">
             {aiStatus.status === 'downloading' && (
                <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center animate-pulse">
                   <Activity className="w-3 h-3 mr-1" />
                   {aiStatus.message}
                </div>
             )}
             {aiStatus.status === 'ready' && (
                <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                   <BrainCircuit className="w-3 h-3 mr-1" />
                   IA Local Pronta
                </div>
             )}
             <button 
               onClick={handleGenerateCase}
               disabled={isGeneratingCase}
               className="btn-cta text-sm py-2 px-4 flex items-center shadow-glow"
             >
               <Sparkles className={`w-4 h-4 mr-2 ${isGeneratingCase ? 'animate-spin' : ''}`} />
               {isGeneratingCase ? 'Gerando Caso...' : 'Gerar Caso com IA'}
             </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {cases.map(c => (
            <div key={c.id} className="card border-l-8 border-l-inep-primary hover:shadow-lg transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{c.title}</h3>
                  <p className="text-gray-600">{c.specialty} • {c.difficulty.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => handleSelectCase(c)}
                  className="bg-inep-primary hover:bg-inep-secondary text-white px-6 py-3 rounded-lg font-bold shadow-md transform hover:scale-105 transition-all"
                >
                  SELECIONAR ESTAÇÃO
                </button>
              </div>
            </div>
          ))}
        </div>

        {showGenModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
               <h3 className="text-xl font-bold mb-4 flex items-center text-inep-primary">
                 <Sparkles className="w-5 h-5 mr-2" />
                 Configurar Caso IA
               </h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                   <select 
                     className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-inep-primary outline-none"
                     value={genParams.specialty}
                     onChange={(e) => setGenParams(prev => ({...prev, specialty: e.target.value}))}
                   >
                     <option>Clínica Médica</option>
                     <option>Cirurgia Geral</option>
                     <option>Pediatria</option>
                     <option>Ginecologia e Obstetrícia</option>
                     <option>Medicina de Família</option>
                     <option>Medicina de Emergência</option>
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade</label>
                   <select 
                     className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-inep-primary outline-none"
                     value={genParams.difficulty}
                     onChange={(e) => setGenParams(prev => ({...prev, difficulty: e.target.value}))}
                   >
                     <option value="basic">Básico (Internato)</option>
                     <option value="intermediate">Intermediário (Generalista)</option>
                     <option value="advanced">Avançado (Residência)</option>
                   </select>
                 </div>

                 <div className="flex justify-end space-x-3 mt-6">
                   <button 
                     onClick={() => setShowGenModal(false)}
                     className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                   >
                     Cancelar
                   </button>
                   <button 
                     onClick={confirmGenerateCase}
                     className="bg-inep-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-inep-secondary shadow-lg transform active:scale-95 transition-all"
                   >
                     Gerar Agora
                   </button>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'reading') {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-gray-900 text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-8 text-yellow-400">Instruções da Estação (Porta da Sala)</h2>
        
        <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl max-w-2xl w-full mb-8 text-left">
          <p className="text-lg mb-4 leading-relaxed font-serif">
            {selectedCase?.description}
          </p>
          <div className="border-t pt-4 mt-4">
            <p className="font-bold">TAREFAS:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Realizar anamnese e exame físico direcionados.</li>
              <li>Solicitar exames complementares se necessário.</li>
              <li>Estabelecer hipótese diagnóstica e conduta terapêutica.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-gray-400 mb-2 uppercase tracking-widest text-sm">Tempo de Leitura Restante</p>
          <div className="text-6xl font-mono font-bold text-yellow-500 mb-8">
            {formatTime(readingTimeLeft)}
          </div>
          
          <button 
            onClick={handleStartCase}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg transition-transform hover:scale-105"
          >
            <DoorOpen className="w-8 h-8 mr-3" />
            ENTRAR NA SALA
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'feedback') {
    const totalScore = finalFeedback.reduce((acc, item) => acc + (item.achieved ? item.points : 0), 0);
    const maxScore = finalFeedback.reduce((acc, item) => acc + item.points, 0);

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-card border-t-4 border-inep-primary">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Desempenho da Estação</h2>
          <div className="flex items-end space-x-2 mb-6">
            <span className="text-5xl font-bold text-inep-primary">{totalScore.toFixed(1)}</span>
            <span className="text-gray-500 text-xl mb-1">/ {maxScore.toFixed(1)} pontos</span>
          </div>
          
          <h3 className="font-bold text-lg mb-4 border-b pb-2">Checklist de Avaliação (Gerado por IA)</h3>
          <div className="space-y-3">
            {finalFeedback.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-lg border flex justify-between items-start ${
                item.achieved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex-1">
                   <div className="flex items-center mb-1">
                     {item.achieved ? (
                       <CheckSquare className="text-green-600 w-5 h-5 mr-2" />
                     ) : (
                       <XSquare className="text-red-600 w-5 h-5 mr-2" />
                     )}
                     <span className={`font-bold ${item.achieved ? 'text-green-800' : 'text-red-800'}`}>
                       {item.criterion}
                     </span>
                   </div>
                   <p className="text-sm text-gray-600 ml-7">{item.examiner_note}</p>
                </div>
                <div className="font-bold text-gray-700 ml-4">
                  {item.achieved ? `+${item.points}` : '0.0'}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={() => { setPhase('selection'); setActiveSimulation(null); }}
              className="btn-primary"
            >
              Voltar para Seleção
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SIMULATION PHASE
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Simulation Header */}
      <div className="bg-gray-900 text-white p-4 rounded-t-lg flex justify-between items-center shadow-lg">
        <div>
          <h2 className="font-bold text-lg">{selectedCase?.title}</h2>
          <span className="text-xs text-gray-400">Modo de Avaliação Oficial</span>
        </div>
        <div className={`flex items-center text-3xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          <Timer className="w-8 h-8 mr-3" />
          {formatTime(timeLeft)}
        </div>
        <button 
          onClick={handleFinishSimulation}
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded uppercase font-bold tracking-wider flex items-center"
          disabled={isAnalyzingFeedback}
        >
          {isAnalyzingFeedback ? (
            <>
              <BrainCircuit className="w-4 h-4 mr-2 animate-spin" />
              Corrigindo...
            </>
          ) : (
            'Encerrar Caso'
          )}
        </button>
      </div>

      {/* Main Interaction Area */}
      <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {dialogueHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'doctor' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-xl shadow-sm ${
                msg.role === 'doctor' 
                  ? 'bg-white text-gray-800 border-r-4 border-inep-primary' 
                  : 'bg-gray-800 text-white border-l-4 border-gray-600'
              }`}>
                <p className="text-xs font-bold mb-2 uppercase tracking-wide opacity-70">
                  {msg.role === 'doctor' ? 'Candidato (Você)' : 'Examinador'}
                </p>
                <p className="text-lg">{msg.text}</p>
              </div>
            </div>
          ))}
          {processingVoice && (
            <div className="flex justify-start">
               <div className="bg-gray-200 text-gray-500 p-4 rounded-xl shadow-sm animate-pulse flex items-center">
                 <BrainCircuit className="w-4 h-4 mr-2 animate-spin text-purple-600" />
                 IA analisando resposta...
               </div>
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="bg-white border-t border-gray-200 p-6 shadow-up z-10">
          <div className="max-w-3xl mx-auto">
             {!supported && (
               <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-center font-bold flex items-center justify-center">
                 <AlertOctagon className="h-5 w-5 mr-2" />
                 Seu navegador não suporta comandos de voz. Use o Chrome ou Edge.
               </div>
             )}
            
            <button
               onClick={isListening ? stopListening : startListening}
               disabled={!supported || isSpeaking || isAnalyzingFeedback}
               className={`w-full py-6 rounded-2xl flex items-center justify-center text-xl font-bold transition-all shadow-lg ${
                 isListening 
                   ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200' 
                   : 'bg-inep-primary hover:bg-inep-secondary text-white'
               } disabled:opacity-50 disabled:cursor-not-allowed`}
             >
               {isListening ? (
                 <><MicOff className="mr-3 h-8 w-8" /> PARAR DE FALAR</>
               ) : (
                 <><Mic className="mr-3 h-8 w-8" /> PRESSIONE PARA FALAR</>
               )}
             </button>
             <p className="text-center text-sm text-gray-500 mt-3">
               Mantenha a postura profissional. Fale de forma clara e objetiva.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
