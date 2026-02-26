import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Stethoscope, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [crm, setCrm] = useState('12345/P');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();
  const { login, user, isLoading, error, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(crm, password);
  };

  return (
    <div className="min-h-screen bg-clinical-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-inep-primary rounded-full flex items-center justify-center shadow-lg">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-inep-primary">
          SGAP-MED Revalida
        </h2>
        <p className="mt-2 text-center text-sm text-clinical-muted">
          Sistema de Avaliação da 2ª Fase do Revalida 2025
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10 border-t-4 border-inep-primary">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="crm" className="block text-sm font-medium text-gray-700">
                CRM Provisório / Inscrição
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="crm"
                  name="crm"
                  type="text"
                  required
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  className="input-field"
                  placeholder="00000/P"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha de Acesso
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erro no login</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-inep-primary hover:bg-inep-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-inep-primary disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? 'Autenticando...' : 'Acessar Ambiente Seguro'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Acesso Institucional</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="flex items-center justify-center space-x-2 text-xs text-clinical-muted bg-gray-50 p-3 rounded-md">
                <ShieldCheck className="h-4 w-4 text-inep-light" />
                <span>Ambiente Monitorado pelo INEP - Edital nº 46</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
