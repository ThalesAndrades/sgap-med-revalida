import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { mockDB } from '../services/mock/db';
import { Check, ArrowRight, Brain, Stethoscope, Baby, Activity, Heart, Users } from 'lucide-react';

const specialties = [
  { id: 'clinica', label: 'Clínica Médica', icon: Stethoscope, color: 'bg-blue-100 text-blue-600' },
  { id: 'cirurgia', label: 'Cirurgia Geral', icon: Activity, color: 'bg-red-100 text-red-600' },
  { id: 'pediatria', label: 'Pediatria', icon: Baby, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'ginecologia', label: 'Ginecologia e Obstetrícia', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { id: 'preventiva', label: 'Medicina de Família e Comunitária', icon: Users, color: 'bg-green-100 text-green-600' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, checkSession } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await mockDB.updateUser(user.id, {
        preferences: {
          onboarding_completed: true,
          focus_areas: selectedSpecialties,
          daily_goal_minutes: 30
        }
      });
      checkSession(); // Refresh user state
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save preferences', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Visual & Context */}
        <div className="md:w-1/3 bg-inep-primary p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Brain className="w-96 h-96 -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Revalida AI</h1>
            <p className="text-blue-200">Sua aprovação começa aqui.</p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className={`transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold mr-3">1</div>
                <h3 className="font-semibold">Boas-vindas</h3>
              </div>
              <p className="text-sm text-blue-100 pl-11">Entenda como nossa IA vai acelerar seu aprendizado.</p>
            </div>

            <div className={`transition-opacity duration-500 ${step === 2 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold mr-3">2</div>
                <h3 className="font-semibold">Foco</h3>
              </div>
              <p className="text-sm text-blue-100 pl-11">Selecione as áreas que você precisa priorizar agora.</p>
            </div>
          </div>

          <div className="relative z-10 text-xs text-blue-300">
            Passo {step} de 2
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Olá, Doutor(a)! 👋</h2>
              <p className="text-lg text-gray-600 mb-8">
                Preparamos uma experiência personalizada para você. Nossa plataforma utiliza 
                <strong> Inteligência Artificial</strong> para simular casos clínicos reais e 
                identificar suas lacunas de conhecimento.
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Aprendizado Adaptativo</h4>
                    <p className="text-sm text-gray-500">O sistema aprende com seus erros e sugere conteúdos específicos.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Simulação Realista</h4>
                    <p className="text-sm text-gray-500">Treine o tempo de resposta e a tomada de decisão sob pressão.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="group flex items-center bg-inep-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-inep-secondary transition-all"
              >
                Vamos começar
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quais suas maiores dificuldades?</h2>
              <p className="text-gray-500 mb-8">Selecione pelo menos uma área para começarmos. Você poderá alterar isso depois.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {specialties.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => toggleSpecialty(spec.label)}
                    className={`p-4 rounded-xl border-2 text-left flex items-center transition-all ${
                      selectedSpecialties.includes(spec.label)
                        ? 'border-inep-primary bg-blue-50 ring-1 ring-inep-primary'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-3 rounded-lg mr-4 ${spec.color}`}>
                      <spec.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`font-semibold block ${selectedSpecialties.includes(spec.label) ? 'text-inep-primary' : 'text-gray-700'}`}>
                        {spec.label}
                      </span>
                    </div>
                    {selectedSpecialties.includes(spec.label) && (
                      <div className="ml-auto bg-inep-primary text-white p-1 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-900 font-medium"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleFinish}
                  disabled={selectedSpecialties.length === 0 || isSubmitting}
                  className={`flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    selectedSpecialties.length === 0 || isSubmitting
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'Configurando...' : 'Finalizar Configuração'}
                  {!isSubmitting && <Check className="ml-2 w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
