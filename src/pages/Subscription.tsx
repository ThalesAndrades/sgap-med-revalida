import React, { useState } from 'react';
import { Check, Shield, Star, CreditCard, Zap, Lock } from 'lucide-react';
import { asaasService, CreditCardData } from '../services/payment/asaas';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime' | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'form' | 'pix'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX'>('CREDIT_CARD');
  const [pixData, setPixData] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: ''
  });
  
  const [cardData, setCardData] = useState<CreditCardData>({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: ''
  });

  const handleSelectPlan = (plan: 'monthly' | 'lifetime') => {
    setSelectedPlan(plan);
    setPaymentStep('form');
    // Monthly is card only
    if (plan === 'monthly') setPaymentMethod('CREDIT_CARD');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Customer
      const customer = await asaasService.createCustomer({
        name: formData.name,
        email: formData.email,
        cpfCnpj: formData.cpf,
        mobilePhone: formData.phone
      });

      // 2. Process Payment
      if (selectedPlan === 'lifetime') {
        const result = await asaasService.createPayment(
          customer.id, 
          799.00, 
          paymentMethod, 
          paymentMethod === 'CREDIT_CARD' ? cardData : undefined
        );

        if (paymentMethod === 'PIX') {
          setPixData(result);
          setPaymentStep('pix');
        } else {
          alert('Pagamento aprovado! Acesso vitalício liberado.');
          navigate('/dashboard');
        }
      } else {
        // Monthly Subscription
        await asaasService.createSubscription(
          customer.id, 
          199.00, 
          cardData
        );
        alert('Assinatura realizada! Bem-vindo.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao processar pagamento. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStep === 'pix' && pixData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento via PIX</h2>
          <p className="text-gray-600 mb-6">Escaneie o QR Code abaixo para liberar seu acesso imediatamente.</p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6 flex justify-center">
             {/* Mock QR Code for visual if encodedImage is broken in mock */}
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixData.pixQrCode}`} alt="QR Code PIX" className="w-48 h-48" />
          </div>
          
          <div className="bg-gray-50 p-3 rounded border text-xs text-gray-500 break-all mb-6">
            {pixData.pixQrCode}
          </div>

          <button 
            onClick={() => { alert('Pagamento confirmado!'); navigate('/dashboard'); }}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
          >
            Já realizei o pagamento
          </button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-gray-900 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold">Finalizar Compra</h2>
            <span className="text-sm bg-gray-800 px-3 py-1 rounded-full">
              {selectedPlan === 'lifetime' ? 'Plano Vitalício - R$ 799' : 'Plano Mensal - R$ 199'}
            </span>
          </div>

          <form onSubmit={handlePayment} className="p-8 space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Dados Pessoais</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required placeholder="Nome Completo" className="border p-3 rounded-lg w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="CPF" className="border p-3 rounded-lg w-full" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input required placeholder="Email" type="email" className="border p-3 rounded-lg w-full" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input required placeholder="Celular" className="border p-3 rounded-lg w-full" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            {/* Payment Method Selection (Only for Lifetime) */}
            {selectedPlan === 'lifetime' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Forma de Pagamento</h3>
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`flex-1 p-4 border rounded-xl flex items-center justify-center space-x-2 transition-all ${paymentMethod === 'CREDIT_CARD' ? 'border-inep-primary bg-blue-50 text-inep-primary ring-2 ring-inep-primary' : 'hover:bg-gray-50'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Cartão de Crédito</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`flex-1 p-4 border rounded-xl flex items-center justify-center space-x-2 transition-all ${paymentMethod === 'PIX' ? 'border-green-600 bg-green-50 text-green-700 ring-2 ring-green-600' : 'hover:bg-gray-50'}`}
                  >
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">PIX (À Vista)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Credit Card Form */}
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Dados do Cartão</h3>
                <div className="space-y-4">
                  <input required placeholder="Nome no Cartão" className="border p-3 rounded-lg w-full" value={cardData.holderName} onChange={e => setCardData({...cardData, holderName: e.target.value})} />
                  <input required placeholder="Número do Cartão" className="border p-3 rounded-lg w-full" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} />
                  <div className="grid grid-cols-3 gap-4">
                    <input required placeholder="Mês (MM)" className="border p-3 rounded-lg w-full" value={cardData.expiryMonth} onChange={e => setCardData({...cardData, expiryMonth: e.target.value})} />
                    <input required placeholder="Ano (AAAA)" className="border p-3 rounded-lg w-full" value={cardData.expiryYear} onChange={e => setCardData({...cardData, expiryYear: e.target.value})} />
                    <input required placeholder="CVV" className="border p-3 rounded-lg w-full" value={cardData.ccv} onChange={e => setCardData({...cardData, ccv: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
               <button type="button" onClick={() => setPaymentStep('select')} className="text-gray-500 hover:text-gray-900 font-medium">Voltar</button>
               <button 
                 type="submit" 
                 disabled={loading}
                 className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg flex items-center"
               >
                 {loading ? 'Processando...' : (
                   <>
                     <Lock className="w-5 h-5 mr-2" />
                     Pagar R$ {selectedPlan === 'lifetime' ? '799,00' : '199,00'}
                   </>
                 )}
               </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Invista na Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Aprovação</span>
        </h1>
        <p className="text-xl text-blue-200">
          A ferramenta definitiva usada por quem passa no Revalida de primeira.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Monthly Plan */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-white hover:transform hover:-translate-y-2 transition-all duration-300">
          <div className="mb-4">
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">Flexível</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Mensal</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-extrabold">R$ 199</span>
            <span className="text-xl text-gray-400 ml-2">/mês</span>
          </div>
          <ul className="space-y-4 mb-8 text-gray-300">
            <li className="flex items-center"><Check className="w-5 h-5 text-blue-400 mr-3" /> Acesso a todos os casos</li>
            <li className="flex items-center"><Check className="w-5 h-5 text-blue-400 mr-3" /> Feedback com IA ilimitado</li>
            <li className="flex items-center"><Check className="w-5 h-5 text-blue-400 mr-3" /> Cancele quando quiser</li>
          </ul>
          <button 
            onClick={() => handleSelectPlan('monthly')}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-colors border border-white/20"
          >
            Assinar Mensal
          </button>
        </div>

        {/* Lifetime Plan (Highlighted) */}
        <div className="relative bg-white text-gray-900 rounded-3xl p-8 shadow-2xl transform scale-105 border-4 border-yellow-400">
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-bl-xl rounded-tr-lg text-sm uppercase tracking-wide">
            Mais Vendido
          </div>
          <div className="mb-4">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold flex w-fit items-center">
              <Star className="w-4 h-4 mr-1 fill-yellow-600 text-yellow-600" /> Premium
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Vitalício</h3>
          <div className="flex items-baseline mb-2">
            <span className="text-5xl font-extrabold text-gray-900">R$ 799</span>
            <span className="text-xl text-gray-500 ml-2">único</span>
          </div>
          <p className="text-sm text-green-600 font-bold mb-6 bg-green-50 p-2 rounded inline-block">
            Economize R$ 1.589 em um ano
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" /> <span className="font-bold">Acesso para sempre</span></li>
            <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" /> Todas as atualizações futuras</li>
            <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" /> Prioridade no suporte</li>
            <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" /> IA ilimitada sem travas</li>
          </ul>
          <button 
            onClick={() => handleSelectPlan('lifetime')}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02]"
          >
            Quero Acesso Vitalício
          </button>
          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1" /> Garantia de 7 dias ou seu dinheiro de volta
          </p>
        </div>
      </div>
      
      <div className="text-center mt-12 text-blue-200/60 text-sm">
        Pagamento seguro via Asaas • Seus dados estão protegidos
      </div>
    </div>
  );
};

export default Subscription;
