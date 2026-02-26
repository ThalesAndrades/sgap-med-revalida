import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Activity, Heart, Stethoscope, Baby, Pill, Search, ChevronRight, Hash, FileText, Database, RefreshCw, Sparkles, X } from 'lucide-react';
import { mockDB } from '../services/mock/db';
import { explainTopicWithAI } from '../services/ai/openai';
import { KnowledgeTopic } from '../types';

const Learning = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'mnemonics' | 'flowcharts' | 'reflexive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [topics, setTopics] = useState<KnowledgeTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<KnowledgeTopic[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [explanation, setExplanation] = useState<{ topicId: string, content: string | null, isLoading: boolean } | null>(null);

  useEffect(() => {
    const loadTopics = async () => {
      const data = await mockDB.getTopics();
      setTopics(data);
      setFilteredTopics(data);
    };
    loadTopics();
  }, []);

  const handleImportExternal = async () => {
    setIsImporting(true);
    const count = await mockDB.importExternalBases();
    const data = await mockDB.getTopics();
    setTopics(data);
    setIsImporting(false);
    alert(`${count} novos tópicos importados de bases externas (Medscape, UpToDate, etc.)!`);
  };

  useEffect(() => {
    let result = topics;
    
    // Filter by Tab
    if (activeTab !== 'all') {
      const typeMap: Record<string, string> = {
        'mnemonics': 'mnemonic',
        'flowcharts': 'flowchart',
        'reflexive': 'concept' 
      };
      if (activeTab === 'mnemonics') result = result.filter(t => t.content_type === 'mnemonic');
      if (activeTab === 'flowcharts') result = result.filter(t => t.content_type === 'flowchart' || t.content_type === 'protocol');
      if (activeTab === 'reflexive') result = result.filter(t => t.content_type === 'concept');
    }

    // Filter by Search
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lower) || 
        t.summary.toLowerCase().includes(lower) ||
        t.tags.some(tag => tag.toLowerCase().includes(lower))
      );
    }

    setFilteredTopics(result);
  }, [activeTab, searchQuery, topics]);

  const handleExplain = async (topic: KnowledgeTopic) => {
    setExplanation({ topicId: topic.id, content: null, isLoading: true });
    const context = JSON.stringify(topic.content);
    const result = await explainTopicWithAI(topic.title, context);
    setExplanation({ topicId: topic.id, content: result, isLoading: false });
  };

  const getIconForCategory = (category: string) => {
    switch(category) {
      case 'Cardiologia': return <Heart className="w-5 h-5 text-red-500" />;
      case 'Pediatria': return <Baby className="w-5 h-5 text-pink-500" />;
      case 'Cirurgia': return <Activity className="w-5 h-5 text-orange-500" />;
      case 'Ginecologia': return <Stethoscope className="w-5 h-5 text-purple-500" />;
      default: return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-inep-primary">Base de Conhecimento</h1>
          <p className="text-clinical-muted mt-1">
            Mais de 200 tópicos médicos, protocolos e diretrizes do Revalida.
          </p>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={handleImportExternal}
             disabled={isImporting}
             className="btn-outline flex items-center text-sm"
           >
             <RefreshCw className={`w-4 h-4 mr-2 ${isImporting ? 'animate-spin' : ''}`} />
             {isImporting ? 'Importando...' : 'Atualizar Bases Externas'}
           </button>
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Buscar por tema, doença ou tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inep-primary focus:border-transparent w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white shadow text-inep-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tudo
            </button>
            <button 
              onClick={() => setActiveTab('mnemonics')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'mnemonics' ? 'bg-white shadow text-inep-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Mnemônicos
            </button>
            <button 
              onClick={() => setActiveTab('flowcharts')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'flowcharts' ? 'bg-white shadow text-inep-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Protocolos
            </button>
            <button 
              onClick={() => setActiveTab('reflexive')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'reflexive' ? 'bg-white shadow text-inep-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Conceitos
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content Area - Topics Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map(topic => (
              <div key={topic.id} className="card hover:shadow-lg transition-all border-l-4 border-inep-secondary group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {getIconForCategory(topic.category)}
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{topic.category}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    topic.content_type === 'mnemonic' ? 'bg-yellow-100 text-yellow-800' :
                    topic.content_type === 'flowchart' || topic.content_type === 'protocol' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {topic.content_type === 'protocol' ? 'Protocolo' : 
                     topic.content_type === 'mnemonic' ? 'Mnemônico' : 
                     topic.content_type === 'flowchart' ? 'Fluxograma' : 'Conceito'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-inep-primary transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {topic.summary}
                </p>

                {/* Content Preview */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                  {topic.content.items && (
                    <div className="space-y-1">
                      {topic.content.items.map((item, idx) => (
                        <div key={idx} className="flex text-sm">
                          <span className="font-bold w-6 text-inep-primary">{item.key}</span>
                          <span className="text-gray-700">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {topic.content.steps && (
                    <div className="flex flex-wrap gap-2">
                      {topic.content.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center text-xs bg-white border border-gray-200 px-2 py-1 rounded">
                          <span className="font-bold mr-1">{idx + 1}.</span> {step}
                          {idx < (topic.content.steps?.length || 0) - 1 && <ChevronRight className="w-3 h-3 ml-2 text-gray-400" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {topic.content.explanation && (
                    <p className="text-sm text-gray-700 italic">
                      "{topic.content.explanation}"
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {topic.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center">
                      <Hash className="w-3 h-3 mr-1 opacity-50" /> {tag}
                    </span>
                  ))}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleExplain(topic); }}
                    className="ml-auto flex items-center text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold hover:bg-purple-200 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Explicar com IA
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Nenhum tópico encontrado para "{searchQuery}"</p>
              <p className="text-sm">Tente buscar por termos como "IAM", "Asma", "Dengue"...</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Stats & Tips */}
        <div className="space-y-6">
          <div className="card bg-inep-primary text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Base de Conhecimento</h3>
                <p className="text-xs text-blue-200">{topics.length} Tópicos Indexados</p>
              </div>
            </div>
            <p className="text-sm text-blue-100 mb-4">
              Esta base é atualizada conforme os últimos PCDTs do Ministério da Saúde e Guidelines Internacionais.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-inep-primary" />
              Referências Bibliográficas
            </h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1" /> Diretrizes da SBC (Cardiologia)</li>
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1" /> GINA / GOLD (Pneumologia)</li>
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1" /> ATLS 10ª Edição (Trauma)</li>
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1" /> Tratado de Pediatria SBP</li>
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1" /> Manuais do Ministério da Saúde</li>
            </ul>
          </div>
        </div>
      </div>

      {explanation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl text-white">
              <h3 className="text-xl font-bold flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                Tutor Inteligente
              </h3>
              <button 
                onClick={() => setExplanation(null)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto prose prose-purple max-w-none">
              {explanation.isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium animate-pulse">Consultando a base de conhecimento...</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                  {explanation.content}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-2xl text-center text-xs text-gray-500">
              O conteúdo é gerado por IA e deve ser conferido com a bibliografia oficial.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
