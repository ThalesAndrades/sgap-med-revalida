import axios from 'axios';

const ASAAS_API_URL = import.meta.env.VITE_ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = import.meta.env.VITE_ASAAS_API_KEY || '';

const api = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    'access_token': ASAAS_API_KEY,
    'Content-Type': 'application/json'
  }
});

export interface CustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  mobilePhone?: string;
}

export interface CreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export const asaasService = {
  async createCustomer(data: CustomerData) {
    if (!ASAAS_API_KEY) {
      console.warn('Asaas API Key missing. Mocking response.');
      return { id: 'cus_mock_' + Date.now() };
    }
    try {
      // Check if customer exists (simplified logic would go here)
      const response = await api.post('/customers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  async createPayment(customerId: string, value: number, billingType: 'PIX' | 'CREDIT_CARD', creditCard?: CreditCardData) {
    if (!ASAAS_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (billingType === 'PIX') {
        return {
          id: 'pay_mock_' + Date.now(),
          invoiceUrl: 'https://sandbox.asaas.com/i/mock',
          bankSlipUrl: null,
          pixQrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Thales Andrades6008Brasilia62070503***6304E2CA',
          encodedImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' // Mock 1x1 pixel
        };
      }
      return {
        id: 'pay_mock_' + Date.now(),
        status: 'CONFIRMED'
      };
    }

    const payload: any = {
      customer: customerId,
      billingType,
      value,
      dueDate: new Date().toISOString().split('T')[0],
    };

    if (billingType === 'CREDIT_CARD' && creditCard) {
      payload.creditCard = creditCard;
      payload.creditCardHolderInfo = {
        name: creditCard.holderName,
        email: 'customer@email.com', // In real app, pass from customer data
        cpfCnpj: '12345678900', // In real app, pass from customer data
        postalCode: '12345-678',
        addressNumber: '123',
        phone: '11999999999'
      };
    }

    const response = await api.post('/payments', payload);
    
    // If PIX, get QR Code
    if (billingType === 'PIX' && response.data.id) {
      const qrResponse = await api.get(`/payments/${response.data.id}/pixQrCode`);
      return { ...response.data, ...qrResponse.data };
    }

    return response.data;
  },

  async createSubscription(customerId: string, value: number, creditCard: CreditCardData) {
    if (!ASAAS_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        id: 'sub_mock_' + Date.now(),
        status: 'ACTIVE'
      };
    }

    const payload = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value,
      nextDueDate: new Date().toISOString().split('T')[0],
      cycle: 'MONTHLY',
      creditCard,
      creditCardHolderInfo: {
        name: creditCard.holderName,
        email: 'customer@email.com',
        cpfCnpj: '12345678900',
        postalCode: '12345-678',
        addressNumber: '123',
        phone: '11999999999'
      }
    };

    const response = await api.post('/subscriptions', payload);
    return response.data;
  }
};
