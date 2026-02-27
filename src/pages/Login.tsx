import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Stethoscope, ShieldCheck, AlertCircle, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { authRegister, authRequestPasswordReset, authResetPassword } from '../services/auth/authApi';

const Login = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isLoading, error, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const token = sp.get('reset') || '';
    if (token) {
      setResetToken(token);
      setMode('reset');
      setLocalError(null);
      setLocalSuccess(null);
      setPassword('');
      setConfirmPassword('');
    }
  }, [location.search]);

  const mergedError = useMemo(() => localError || error, [localError, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    if (mode === 'forgot') {
      if (!email || !email.includes('@')) {
        setLocalError('Digite um e-mail válido');
        return;
      }
      setIsSubmitting(true);
      try {
        await authRequestPasswordReset(email);
        setLocalSuccess('Se existir uma conta para este e-mail, você receberá um link para redefinir a senha.');
        setMode('login');
      } catch (e2) {
        const msg = e2 instanceof Error ? e2.message : 'Erro ao solicitar redefinição';
        setLocalError(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'reset') {
      if (!resetToken) {
        setLocalError('Link inválido');
        return;
      }
      if (password.length < 8) {
        setLocalError('A senha precisa ter pelo menos 8 caracteres');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('As senhas não coincidem');
        return;
      }
      setIsSubmitting(true);
      try {
        await authResetPassword(resetToken, password);
        await checkSession();
        navigate('/dashboard');
      } catch (e2) {
        const msg = e2 instanceof Error ? e2.message : 'Erro ao redefinir senha';
        setLocalError(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!email || !email.includes('@')) {
      setLocalError('Digite um e-mail válido');
      return;
    }
    if (password.length < 8) {
      setLocalError('A senha precisa ter pelo menos 8 caracteres');
      return;
    }
    if (mode === 'register') {
      if (password !== confirmPassword) {
        setLocalError('As senhas não coincidem');
        return;
      }
      setIsSubmitting(true);
      try {
        await authRegister(email, password);
        await login(email, password);
      } catch (e2) {
        const msg = e2 instanceof Error ? e2.message : 'Erro ao criar conta';
        setLocalError(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-400 shadow-lg" />
            <div>
              <div className="text-white font-extrabold tracking-tight">Revalida AI</div>
              <div className="text-xs text-slate-300">Acesso beta • login seguro</div>
            </div>
          </div>
          <a
            href="https://revalidaai.med.br"
            className="text-sm text-slate-200 hover:text-white transition-colors"
          >
            Voltar para o site
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center text-xs font-bold text-purple-100 bg-purple-500/20 border border-purple-400/20 px-3 py-1 rounded-full">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Beta fechado com whitelist
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Entre para treinar como se fosse o dia da prova
              </h1>
              <p className="mt-3 text-slate-200 leading-relaxed">
                Você acessa simulações realistas, base de conhecimento e feedback estruturado. Contas novas só são liberadas para e-mails autorizados.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold text-white">Acesso vitalício</div>
                  <div className="text-xs text-slate-300 mt-1">Pagamento único no beta</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold text-white">Grupo até 3</div>
                  <div className="text-xs text-slate-300 mt-1">R$600 por pessoa</div>
                </div>
              </div>

              <div className="mt-6 flex items-center text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-300" />
                Sessão segura, cookies HttpOnly e senha com hash
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-inep-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-extrabold">
                    {mode === 'login' ? 'Entrar' : (mode === 'register' ? 'Criar conta' : (mode === 'forgot' ? 'Recuperar senha' : 'Redefinir senha'))}
                  </div>
                  <div className="text-xs text-slate-300">Use o e-mail autorizado na whitelist</div>
                </div>
              </div>
              {mode !== 'reset' && (
                <div className="flex rounded-xl bg-black/20 border border-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setLocalError(null); setLocalSuccess(null); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'login' ? 'bg-white text-slate-900' : 'text-slate-200 hover:text-white'}`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setLocalError(null); setLocalSuccess(null); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'register' ? 'bg-white text-slate-900' : 'text-slate-200 hover:text-white'}`}
                  >
                    Criar
                  </button>
                </div>
              )}
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-100">E-mail</label>
                <div className="mt-1 relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-black/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/30"
                    placeholder="seuemail@exemplo.com"
                    required
                  />
                </div>
              </div>
              )}

              {(mode === 'login' || mode === 'register' || mode === 'reset') && (
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-100">Senha</label>
                  <div className="mt-1 relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-black/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/30"
                      placeholder="mínimo 8 caracteres"
                      required
                    />
                  </div>
                </div>
              )}

              {(mode === 'register' || mode === 'reset') && (
                <div>
                  <label htmlFor="confirm" className="block text-sm font-semibold text-slate-100">Confirmar senha</label>
                  <div className="mt-1 relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-black/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/30"
                      placeholder="repita sua senha"
                      required
                    />
                  </div>
                </div>
              )}

              {localSuccess && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="text-sm font-bold text-emerald-100">Tudo certo</div>
                  <div className="text-sm text-emerald-100/90 mt-1">{localSuccess}</div>
                </div>
              )}

              {mergedError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-300 mt-0.5" />
                    <div className="ml-3">
                      <div className="text-sm font-bold text-red-100">Não foi possível continuar</div>
                      <div className="text-sm text-red-100/90 mt-1">{mergedError}</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full py-3 rounded-2xl font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading || isSubmitting ? 'Processando...' : (mode === 'login' ? 'Entrar' : (mode === 'register' ? 'Criar conta' : (mode === 'forgot' ? 'Enviar link' : 'Redefinir senha')))}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </form>

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => { setMode('forgot'); setLocalError(null); setLocalSuccess(null); setPassword(''); setConfirmPassword(''); }}
                className="mt-4 text-sm text-slate-200 hover:text-white transition-colors"
              >
                Esqueci minha senha
              </button>
            )}

            {(mode === 'forgot' || mode === 'reset') && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLocalError(null);
                  setLocalSuccess(null);
                  setResetToken('');
                  navigate('/login', { replace: true });
                }}
                className="mt-4 text-sm text-slate-200 hover:text-white transition-colors"
              >
                Voltar para entrar
              </button>
            )}

            <div className="mt-4 text-xs text-slate-300">
              {mode === 'register'
                ? 'Ao criar conta, você confirma que seu e-mail está autorizado no beta.'
                : (mode === 'forgot'
                  ? 'Você receberá um link para redefinir sua senha (se existir conta).'
                  : (mode === 'reset'
                    ? 'Crie uma senha nova para continuar.'
                    : 'Se você não tem acesso, entre na whitelist no domínio principal.'))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
