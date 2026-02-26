import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Clock, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  BookOpen,
  Brain
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { mockDB } from '../services/mock/db';
import { Simulation, Case } from '../types';

const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
  <div className="card hover:shadow-card-hover transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-clinical-muted">{title}</p>
        <p className="mt-1 text-2xl font-bold text-inep-primary">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [recentSimulations, setRecentSimulations] = useState<Simulation[]>([]);
  const [availableCases, setAvailableCases] = useState<Case[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const sims = await mockDB.getUserSimulations(user.id);
        const cases = await mockDB.getCases();
        setRecentSimulations(sims);
        setAvailableCases(cases);
      }
    };
    fetchData();
  }, [user]);

  const completedSims = recentSimulations.filter(s => s.status === 'completed');
  const averageScore = completedSims.length > 0 
    ? Math.round(completedSims.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedSims.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-inep-primary">Painel do Candidato</h1>
          <p className="text-clinical-muted mt-1">
            Acompanhamento de desempenho - Edital nº 46/2025
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Status: Ativo
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Simulações Realizadas" 
          value={completedSims.length} 
          icon={FileText} 
          color="bg-blue-600" 
          description="Total de casos finalizados"
        />
        <StatCard 
          title="Média Geral" 
          value={`${averageScore}/100`} 
          icon={Trophy} 
          color="bg-yellow-500" 
          description="Pontuação média acumulada"
        />
        <StatCard 
          title="Tempo Médio" 
          value="08:45" 
          icon={Clock} 
          color="bg-purple-600" 
          description="Por estação clínica"
        />
        <StatCard 
          title="Desempenho" 
          value="+12%" 
          icon={TrendingUp} 
          color="bg-green-600" 
          description="Evolução semanal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-inep-primary flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Histórico Recente
          </h2>
          <div className="card p-0 overflow-hidden">
            {recentSimulations.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caso</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSimulations.slice(0, 5).map((sim) => {
                    const caseDetail = availableCases.find(c => c.id === sim.case_id);
                    return (
                      <tr key={sim.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {caseDetail?.title || 'Caso desconhecido'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sim.start_time).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sim.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sim.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sim.score !== undefined ? sim.score : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Nenhuma simulação realizada ainda. Inicie um treino!
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-inep-primary flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Acesso Rápido
          </h2>
          <div className="grid gap-4">
            <button 
              onClick={() => navigate('/treinamento')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-inep-primary hover:shadow-md transition-all text-left group"
            >
              <h3 className="font-semibold text-inep-primary group-hover:text-blue-700">Novo Treinamento</h3>
              <p className="text-sm text-gray-500 mt-1">Praticar casos sem limite de tempo</p>
              <div className="mt-3 flex items-center text-sm text-blue-600 font-medium">
                Iniciar agora <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </button>

            <button 
              onClick={() => navigate('/simulacao')}
              className="bg-inep-primary p-4 rounded-lg shadow-sm border border-transparent hover:bg-inep-secondary transition-all text-left group"
            >
              <h3 className="font-semibold text-white">Simulação Real</h3>
              <p className="text-sm text-blue-200 mt-1">Modo prova: 10 minutos cronometrados</p>
              <div className="mt-3 flex items-center text-sm text-white font-medium">
                Começar Prova <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </button>

            <button 
              onClick={() => navigate('/aprendizagem')}
              className="bg-purple-600 p-4 rounded-lg shadow-sm border border-transparent hover:bg-purple-700 transition-all text-left group"
            >
              <h3 className="font-semibold text-white flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Aprendizagem
              </h3>
              <p className="text-sm text-purple-200 mt-1">Tutoria, Mnemônicos e Fluxogramas</p>
            </button>
          </div>

          <div className="card bg-blue-50 border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Dica do Dia</h3>
            <p className="text-sm text-blue-800">
              Na estação de Cardiologia, lembre-se sempre de solicitar o ECG nos primeiros 10 minutos de dor torácica. O tempo porta-agulha é critério eliminatório.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
