import React, { useState, useEffect, useRef } from 'react';
import { useVoice } from '../hooks/useVoice';
import { mockDB } from '../services/mock/db';
import { Case, Finding } from '../types';
import { Mic, MicOff, Volume2, Play, AlertCircle, CheckCircle } from 'lucide-react';
import VoiceSettings from '../components/VoiceSettings';

const Training = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [revealedFindings, setRevealedFindings] = useState<string[]>([]);
  const [dialogueHistory, setDialogueHistory] = useState<{role: 'doctor' | 'examiner', text: string}[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, supported, voices, ttsSettings, setTTSSettings } = useVoice({
    onTranscript: (text) => handleUserVoiceInput(text)
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCases = async () => {
      const data = await mockDB.getCases();
      setCases(data);
    };
    loadCases();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dialogueHistory]);

  const handleSelectCase = async (caseId: string) => {
    const c = cases.find(i => i.id === caseId);
    if (c) {
      setSelectedCase(c);
      const f = await mockDB.getFindingsByCaseId(caseId);
      setFindings(f);
      setRevealedFindings([]);
      setDialogueHistory([{ role: 'examiner', text: `Caso Iniciado: ${c.description}. Pode começar sua avaliação.` }]);
      speak(`Caso Iniciado. ${c.description}. Pode começar sua avaliação.`);
    }
  };

  const handleUserVoiceInput = (text: string) => {
    if (!selectedCase) return;

    setDialogueHistory(prev => [...prev, { role: 'doctor', text }]);
    processInput(text);
  };

  const processInput = (text: string) => {
    // Simple keyword matching for prototype
    const lowerText = text.toLowerCase();
    let found = false;
    let response = "Não entendi sua solicitação. Por favor, seja mais específico.";

    // Check against findings
    for (const finding of findings) {
      if (!revealedFindings.includes(finding.id)) {
        // Very basic keyword matching logic - in production would use NLP/LLM
        const keywords = finding.description.toLowerCase().split(' ');
        const match = keywords.some(k => k.length > 3 && lowerText.includes(k));
        
        if (match || lowerText.includes(finding.finding_type)) {
          setRevealedFindings(prev => [...prev, finding.id]);
          response = finding.response_text;
          found = true;
          break;
        }
      }
    }

    if (!found) {
       if (lowerText.includes("olá") || lowerText.includes("bom dia")) {
           response = "Bom dia doutor. Estou aguardando suas perguntas.";
       } else if (lowerText.includes("diagnóstico")) {
           response = "Qual a sua hipótese diagnóstica?";
       }
    }

    setDialogueHistory(prev => [...prev, { role: 'examiner', text: response }]);
    speak(response);
  };

  if (!selectedCase) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-inep-primary">Módulo de Treinamento</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map(c => (
            <div key={c.id} className="card hover:shadow-card-hover cursor-pointer" onClick={() => handleSelectCase(c.id)}>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  c.difficulty === 'basic' ? 'bg-green-100 text-green-800' :
                  c.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {c.difficulty === 'intermediate' ? 'Intermediário' : 
                   c.difficulty === 'basic' ? 'Básico' : 'Avançado'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{c.specialty}</p>
              <p className="text-sm text-gray-500 mt-4 line-clamp-3">{c.description}</p>
              <button className="mt-4 w-full btn-outline">Iniciar Treino</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Left Panel - Dialogue */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-card overflow-hidden">
        <div className="p-4 bg-inep-primary text-white flex justify-between items-center">
          <div>
            <h2 className="font-bold">{selectedCase.title}</h2>
            <p className="text-xs text-blue-200">{selectedCase.specialty}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowVoiceSettings(true)}
              className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 flex items-center"
              type="button"
            >
              <Volume2 className="h-3 w-3 mr-1" />
              Voz
            </button>
            <button onClick={() => setSelectedCase(null)} className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30">
              Trocar Caso
            </button>
          </div>
        </div>

        <VoiceSettings
          isOpen={showVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
          voices={voices}
          language="pt-BR"
          ttsSettings={ttsSettings}
          setTTSSettings={setTTSSettings}
          onTest={() => speak('Teste de voz. No treinamento, ajuste para ficar mais humano e confortável.')}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
          {dialogueHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'doctor' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'doctor' 
                  ? 'bg-inep-primary text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                <p className="text-xs font-bold mb-1 opacity-70">{msg.role === 'doctor' ? 'Você' : 'Examinador'}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isSpeaking && (
            <div className="flex justify-start">
               <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex items-center space-x-2">
                 <Volume2 className="h-4 w-4 animate-pulse text-inep-primary" />
                 <span className="text-sm text-gray-500">Falando...</span>
               </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
           {!supported && (
             <div className="mb-2 p-2 bg-red-50 text-red-700 text-xs rounded flex items-center">
               <AlertCircle className="h-3 w-3 mr-1" /> Navegador não suporta reconhecimento de voz.
             </div>
           )}
           <div className="flex items-center space-x-2">
             <button
               onClick={isListening ? stopListening : startListening}
               disabled={!supported || isSpeaking}
               className={`flex-1 py-3 rounded-lg flex items-center justify-center font-bold transition-all ${
                 isListening 
                   ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                   : 'bg-inep-primary hover:bg-inep-secondary text-white'
               } disabled:opacity-50 disabled:cursor-not-allowed`}
             >
               {isListening ? (
                 <><MicOff className="mr-2 h-5 w-5" /> Parar (Ouvindo...)</>
               ) : (
                 <><Mic className="mr-2 h-5 w-5" /> Falar (Segure ou Clique)</>
               )}
             </button>
           </div>
           <p className="text-center text-xs text-gray-400 mt-2">
             Clique para falar sua conduta ou pergunta.
           </p>
        </div>
      </div>

      {/* Right Panel - PEP Board */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col space-y-4">
        <div className="bg-white rounded-lg shadow-card p-4 flex-1 overflow-y-auto">
          <h3 className="font-bold text-inep-primary border-b pb-2 mb-4 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Achados Clínicos (PEP)
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Anamnese</h4>
              {findings.filter(f => f.finding_type === 'anamnesis' && revealedFindings.includes(f.id)).length === 0 && (
                <p className="text-sm text-gray-400 italic">Nenhum dado coletado.</p>
              )}
              {findings.filter(f => f.finding_type === 'anamnesis' && revealedFindings.includes(f.id)).map(f => (
                <div key={f.id} className="mb-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500 text-sm">
                  <span className="font-semibold block">{f.description}:</span>
                  {f.response_text}
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Exame Físico</h4>
              {findings.filter(f => f.finding_type === 'physical_exam' && revealedFindings.includes(f.id)).length === 0 && (
                <p className="text-sm text-gray-400 italic">Nenhum dado coletado.</p>
              )}
              {findings.filter(f => f.finding_type === 'physical_exam' && revealedFindings.includes(f.id)).map(f => (
                <div key={f.id} className="mb-2 p-2 bg-green-50 rounded border-l-4 border-green-500 text-sm">
                   <span className="font-semibold block">{f.description}:</span>
                   {f.response_text}
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Exames Complementares</h4>
              {findings.filter(f => f.finding_type === 'complementary_exam' && revealedFindings.includes(f.id)).length === 0 && (
                <p className="text-sm text-gray-400 italic">Nenhum dado coletado.</p>
              )}
              {findings.filter(f => f.finding_type === 'complementary_exam' && revealedFindings.includes(f.id)).map(f => (
                <div key={f.id} className="mb-2 p-2 bg-purple-50 rounded border-l-4 border-purple-500 text-sm">
                   <span className="font-semibold block">{f.description}:</span>
                   {f.response_text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
           <h4 className="font-bold text-yellow-800 text-sm mb-1">Nota do Preceptor</h4>
           <p className="text-xs text-yellow-700">
             Lembre-se de seguir a ordem lógica: Anamnese &gt; Exame Físico &gt; Hipótese &gt; Conduta.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Training;
