import api from './Api';

export interface Transaction {
  id: number;
  payerId: number;
  payeeId: number;
  requestId: number;
  amount: number;
  originalAmount: number | null;
  convertedAmount: number | null;
  travelPayment?: number | null;
  travelerPayment: number | null;
  status: string;
  paymentMethod: string;
  currencyCode: string;
  stripePaymentIntentId: string | null;
  stripeTransferId: string | null;
  createdAt: string;
  updatedAt: string;
  showReleaseFundButton?: boolean;
  payer: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  payee: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  request: {
    id: number;
    requestType: string;
    weight: number | null;
  } | null;
}

export interface TransactionResponse {
  items: Transaction[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface Balance {
  available: number;
  pending: number;
  currency: string;
}

export const getTransactions = async (page = 1, limit = 10): Promise<TransactionResponse> => {
  try {
    const response = await api.get('/transaction', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      items: [],
      meta: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  }
};

export const releaseFunds = async (transactionId: number): Promise<void> => {
  try {
    await api.post(`/transaction/${transactionId}/release-funds`);
  } catch (error: any) {
    console.error('Error releasing funds:', error);
    throw error?.response?.data || error;
  }
};

export const getBalance = async (): Promise<Balance> => {
  try {
    const response = await api.get('/transaction/balance');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching balance:', error);
    throw error?.response?.data || error;
  }
};
