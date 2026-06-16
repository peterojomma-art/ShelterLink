import axios from 'axios';
import { logger } from '@/utils/logger';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not set');
}

interface PaystackInitializePaymentParams {
  amount: number; // Amount in kobo (1 naira = 100 kobo)
  email: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  metadata?: Record<string, any>;
  callbackUrl?: string;
}

interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    reference: string;
    amount: number;
    paid_at: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
    authorization: {
      authorization_url: string;
      authorization_code: string;
      card_type: string;
      last4: string;
      exp_month: string;
      exp_year: string;
    };
    status: string;
  };
}

class PaystackService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: PAYSTACK_BASE_URL,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initialize a payment transaction
   */
  async initializePayment(
    params: PaystackInitializePaymentParams
  ): Promise<PaystackTransactionResponse> {
    try {
      const response = await this.axiosInstance.post<PaystackTransactionResponse>(
        '/transaction/initialize',
        {
          amount: params.amount,
          email: params.email,
          first_name: params.firstName,
          last_name: params.lastName,
          description: params.description,
          metadata: params.metadata,
          callback_url: params.callbackUrl,
        }
      );

      logger.info('Paystack payment initialized', {
        reference: response.data.data?.reference,
        email: params.email,
        amount: params.amount,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to initialize Paystack payment', error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await this.axiosInstance.get<PaystackVerifyResponse>(
        `/transaction/verify/${reference}`
      );

      logger.info('Paystack payment verified', {
        reference,
        status: response.data.data?.status,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to verify Paystack payment', error, { reference });
      throw error;
    }
  }

  /**
   * Fetch a transaction by reference
   */
  async fetchTransaction(reference: string) {
    try {
      const response = await this.axiosInstance.get(
        `/transaction/verify/${reference}`
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch transaction', error, { reference });
      throw error;
    }
  }

  /**
   * List transactions
   */
  async listTransactions(params?: Record<string, any>) {
    try {
      const response = await this.axiosInstance.get('/transaction', {
        params,
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to list transactions', error);
      throw error;
    }
  }

  /**
   * Create a transfer recipient
   */
  async createTransferRecipient(
    name: string,
    accountNumber: string,
    bankCode: string,
    currency: string = 'NGN'
  ) {
    try {
      const response = await this.axiosInstance.post('/transferrecipient', {
        type: 'nuban',
        name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency,
      });

      logger.info('Transfer recipient created', { name, bankCode });
      return response.data;
    } catch (error) {
      logger.error('Failed to create transfer recipient', error);
      throw error;
    }
  }

  /**
   * Initiate a transfer (payout to bank)
   */
  async initiateTransfer(
    recipient: string,
    amount: number,
    reason?: string
  ) {
    try {
      const response = await this.axiosInstance.post('/transfer', {
        source: 'balance',
        recipient,
        amount,
        reason,
      });

      logger.info('Transfer initiated', { recipient, amount });
      return response.data;
    } catch (error) {
      logger.error('Failed to initiate transfer', error);
      throw error;
    }
  }

  /**
   * Verify transfer recipient
   */
  async verifyBankAccount(
    accountNumber: string,
    bankCode: string
  ) {
    try {
      const response = await this.axiosInstance.get(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to verify bank account', error);
      throw error;
    }
  }

  /**
   * Get list of banks
   */
  async getBanks() {
    try {
      const response = await this.axiosInstance.get('/bank');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch banks', error);
      throw error;
    }
  }
}

export const paystackService = new PaystackService();
