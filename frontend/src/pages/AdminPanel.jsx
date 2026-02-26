import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPanel() {
  const [tab, setTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tab === 'transactions') fetchAllTransactions();
    else fetchAllUsers();
  }, [tab]);

  const fetchAllTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/transactions/all');
      setTransactions(res.data || []);
    } catch {
      setError('Could not load transactions. Backend endpoint may not be available yet.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data || []);
    } catch {
      setError('Could not load users. Backend endpoint may not be available yet.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.patch(`/transactions/${id}`, { status });
      fetchAllTransactions();
    } catch {
      setError('Failed to update transaction.');
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

  const tabs = [
    { key: 'transactions', label: 'All Transactions' },
    { key: 'users', label: 'All Users' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-8 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === t.key
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : tab === 'transactions' ? (
        /* Transactions table */
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500">No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Symbol</th>
                    <th className="px-6 py-3 font-medium">Qty</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-700/30">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{tx.userId?.email || tx.userId}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${tx.type === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {tx.type?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{tx.symbol}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{tx.quantity}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">${tx.price?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(tx._id, 'approved')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(tx._id, 'rejected')}
                              className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Users table */
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden">
          {users.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-700/30">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          u.role === 'Admin'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
