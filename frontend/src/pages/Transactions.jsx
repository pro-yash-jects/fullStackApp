import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Trade form
  const [form, setForm] = useState({ symbol: '', quantity: '', price: '', type: 'buy' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data || []);
    } catch {
      setError('Could not load transactions. Backend endpoint may not be available yet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.post(`/transactions/${form.type}`, {
        symbol: form.symbol.toUpperCase(),
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
      setSuccess(`${form.type.toUpperCase()} order submitted successfully!`);
      setForm({ symbol: '', quantity: '', price: '', type: 'buy' });
      fetchTransactions();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit order.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Trading</h1>

      {/* Trade form */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Place an Order</h2>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg p-3 mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Type toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Type</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'buy' })}
                className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                  form.type === 'buy'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'sell' })}
                className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                  form.type === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Symbol</label>
            <input
              type="text"
              required
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              placeholder="AAPL"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Quantity</label>
            <input
              type="number"
              required
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="10"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Price ($)</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="150.00"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-colors cursor-pointer ${
                form.type === 'buy'
                  ? 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50'
                  : 'bg-red-600 hover:bg-red-500 disabled:bg-red-600/50'
              }`}
            >
              {submitting ? 'Submitting...' : form.type === 'buy' ? 'Place Buy' : 'Place Sell'}
            </button>
          </div>
        </form>
      </div>

      {/* Transaction history */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction History</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            No transactions yet. Place your first order above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Symbol</th>
                  <th className="px-6 py-3 font-medium">Qty</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/20">
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${tx.type === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {tx.type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{tx.symbol}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{tx.quantity}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">${tx.price?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">${(tx.quantity * tx.price)?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
