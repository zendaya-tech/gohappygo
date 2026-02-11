import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  getTransactions,
  releaseFunds,
  getBalance,
  type Transaction,
  type Balance,
} from '~/services/transactionService';

export function PaymentsSection({
  profileStats,
  displayUser,
  processingOnboarding,
  handleStripeOnboarding,
}: {
  profileStats: any;
  displayUser?: any;
  processingOnboarding: boolean;
  handleStripeOnboarding: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<'balance' | 'transactions' | 'earnings'>('earnings');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [releasingFunds, setReleasingFunds] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch balance
        const balanceData = await getBalance();
        setBalance(balanceData);

        // Fetch transactions
        const transactionData = await getTransactions(1, 10);
        setTransactions(transactionData.items);
        setHasMore(transactionData.items.length === 10);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMoreTransactions = async () => {
    try {
      const nextPage = page + 1;
      const transactionData = await getTransactions(nextPage, 10);
      setTransactions((prev) => [...prev, ...transactionData.items]);
      setPage(nextPage);
      setHasMore(transactionData.items.length === 10);
    } catch (error) {
      console.error('Error loading more transactions:', error);
    }
  };

  const handleReleaseFunds = async (transactionId: number) => {
    setReleasingFunds(transactionId);
    try {
      await releaseFunds(transactionId);
      // Refresh data
      const balanceData = await getBalance();
      setBalance(balanceData);
      const transactionData = await getTransactions(1, 10);
      setTransactions(transactionData.items);
      setSuccessMessage(t('profile.payments.fundsReleased'));
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error releasing funds:', error);
      const errorMsg =
        error?.message || error?.error?.message || t('profile.payments.releaseError');
      setErrorMessage(errorMsg);
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setReleasingFunds(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return t('common.completed');
      case 'pending':
        return t('common.pending');
      case 'failed':
        return t('common.failed');
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="text-center text-gray-500">{t('profile.payments.loadingPayments')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab('earnings')}
          className={`text-sm font-semibold cursor-pointer ${tab === 'earnings' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          | {t('profile.payments.config')}
        </button>
        <button
          onClick={() => setTab('balance')}
          className={`text-sm font-semibold cursor-pointer ${tab === 'balance' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          | {t('profile.payments.balance')}
        </button>
        <button
          onClick={() => setTab('transactions')}
          className={`text-sm font-semibold cursor-pointer ${tab === 'transactions' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          | {t('profile.payments.transactions')}
        </button>
      </div>

      {/* Balance Tab */}
      {tab === 'balance' && balance && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available Balance */}
            <div className="bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  {t('profile.payments.availableBalance')}
                </h3>
                <CurrencyDollarIcon className="h-6 w-6 opacity-75" />
              </div>
              <div className="text-2xl font-bold">
                {balance.available.toFixed(2)} {balance.currency.toUpperCase()}
              </div>
              <p className="text-xs opacity-75 text-white mt-1">
                {t('profile.payments.readyToWithdraw')}
              </p>
            </div>

            {/* Pending Balance */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  {t('profile.payments.pendingBalance')}
                </h3>
                <svg className="h-6 w-6 opacity-75" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="text-2xl font-bold">
                {balance.pending.toFixed(2)} {balance.currency.toUpperCase()}
              </div>
              <p className="text-xs opacity-75 text-white mt-1">
                {t('profile.payments.processing')}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover transition-colors cursor-pointer">
              {t('profile.payments.transfer')}
            </button>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {tab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-red-800 font-medium">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="text-red-600 hover">
                ✕
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <p className="text-green-800 font-medium">{successMessage}</p>
              <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover">
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('profile.payments.transactionHistory')}
            </h3>
            <div className="text-sm text-gray-500">
              {transactions.length}{' '}
              {t('profile.payments.transaction', { count: transactions.length })}
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
              <img
                src="/images/noPaiements.jpeg"
                alt="No reservations"
                className="w-[50%] h-[50%]"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Transaction #{transaction.id}
                          </h4>
                          {transaction.request && (
                            <p className="text-sm text-gray-500">
                              Demande #{transaction.request.id} - {transaction.request.weight}kg
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(transaction.createdAt)}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                        >
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {(
                          transaction.travelPayment ??
                          transaction.travelerPayment ??
                          transaction.amount
                        ).toFixed(2)}{' '}
                        {transaction.currencyCode.toUpperCase()}
                      </div>
                      {transaction.showReleaseFundButton && (
                        <button
                          onClick={() => handleReleaseFunds(transaction.id)}
                          disabled={releasingFunds === transaction.id}
                          className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {releasingFunds === transaction.id
                            ? '...'
                            : t('profile.payments.release')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={loadMoreTransactions}
                  className="w-full py-3 text-blue-600 hover font-medium"
                >
                  {t('profile.payments.loadMore')}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Earnings Tab */}
      {tab === 'earnings' && balance && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuration</h3>

          {/* Stripe Account Alert - Show for users with pending Stripe account */}
          {displayUser?.stripeAccountStatus === 'pending' || !displayUser?.stripeAccountId ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col justify-center items-center text-center">
                <div className="flex gap-2 justify-center">
                  <svg
                    className="w-6 h-6 "
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Le cercle de fond jaune (plus clair) */}
                    <circle cx="50" cy="50" r="45" fill="#F4D951" />

                    {/* La bordure extérieure (jaune plus foncé/doré) */}
                    <circle cx="50" cy="50" r="45" stroke="#E6C13E" strokeWidth="8" />

                    {/* La coche verte avec des extrémités arrondies */}
                    <path
                      d="M30 52L43 65L72 36"
                      stroke="#22A925"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h3 className="text-sm font-semibold text-yellow-800">
                    {t('profile.payments.stripeAccount')}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 bg-yellow-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-800">
                    {t('profile.payments.createStripeDesc')}
                  </p>
                  <p className="text-sm text-yellow-800">{t('profile.payments.clickToRegister')}</p>
                </div>
                <button
                  onClick={handleStripeOnboarding}
                  disabled={processingOnboarding}
                  className="w-[40%] bg-green-500 hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingOnboarding ? t('common.loading') : t('profile.payments.register')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col justify-center items-center text-center">
                <div className="flex gap-2 justify-center mb-4">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="45" fill="#F4D951" />
                    <circle cx="50" cy="50" r="45" stroke="#E6C13E" strokeWidth="8" />
                    <path
                      d="M30 52L43 65L72 36"
                      stroke="#22A925"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h3 className="text-sm font-semibold text-blue-900">
                    {t('profile.payments.stripeAccount')}
                  </h3>
                </div>

                <div className="flex flex-col gap-2 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-900">{t('profile.payments.updateInfo')}</p>
                  <p className="text-sm text-blue-900">{t('profile.payments.clickToUpdate')}</p>
                </div>

                <button
                  onClick={handleStripeOnboarding}
                  disabled={processingOnboarding}
                  className="w-fit min-w-[40%] bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingOnboarding ? t('common.loading') : t('profile.payments.update')}
                </button>
              </div>
            </div>
          )}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> /*}
                                {/* Earnings Chart Placeholder */}
          {/*<div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                                  <div className="text-center text-gray-500">
                                    <svg className="h-12 w-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L3.5 15.9l.01 2.59z" />
                                    </svg>
                                    <p>Graphique des gains</p>
                                    <p className="text-sm">Bientôt disponible</p>
                                  </div>
                                </div> /*}

                                {/* Earnings Summary */}
          {/*<div className="space-y-4">
                                  <div className="bg-blue-50 rounded-xl p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">Solde disponible</h4>
                                    <div className="text-2xl font-bold text-blue-600">
                                      {balance.available.toFixed(2)} {balance.currency.toUpperCase()}
                                    </div>
                                    <p className="text-sm text-blue-700">Prêt à être retiré</p>
                                  </div>

                                  <div className="bg-green-50 rounded-xl p-4">
                                    <h4 className="font-medium text-green-900 mb-2">Solde en attente</h4>
                                    <div className="text-2xl font-bold text-green-600">
                                      {balance.pending.toFixed(2)} {balance.currency.toUpperCase()}
                                    </div>
                                    <p className="text-sm text-green-700">En cours de traitement</p>
                                  </div>

                                  <div className="bg-purple-50 rounded-xl p-4">
                                    <h4 className="font-medium text-purple-900 mb-2">Solde total</h4>
                                    <div className="text-2xl font-bold text-purple-600">
                                      {(balance.available + balance.pending).toFixed(2)}{' '}
                                      {balance.currency.toUpperCase()}
                                    </div>
                                    <p className="text-sm text-purple-700">Disponible + En attente</p>
                                  </div>
                                </div>
                              </div> */}
        </div>
      )}
    </div>
  );
}
