import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StockCard from '../components/StockCard';

export default function Dashboard() {
  const { user, watchlist } = useAuth();
  const [symbol, setSymbol] = useState('');
  const [quote, setQuote] = useState(null);
  const [searchedSymbol, setSearchedSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) return;

    setError('');
    setQuote(null);
    setLoading(true);
    try {
      const res = await api.get(`/stocks/search/${trimmed}`);
      if (res.data.c === 0 && res.data.h === 0 && res.data.l === 0) {
        setError('No data found for this symbol. Make sure it is a valid US stock ticker.');
      } else {
        setQuote(res.data);
        setSearchedSymbol(trimmed);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to fetch stock data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const popularTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Search for a stock to get real-time price data.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g. AAPL)"
              className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {/* Quick tickers */}
      <div className="flex flex-wrap gap-2 mb-8">
        {popularTickers.map((t) => (
          <button
            key={t}
            onClick={() => { setSymbol(t); }}
            className="bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Result */}
      {quote && <StockCard symbol={searchedSymbol} data={quote} />}

      {/* Watchlist section */}
      {watchlist.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Your Watchlist</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {watchlist.map((s) => (
              <button
                key={s}
                onClick={() => { setSymbol(s); }}
                className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 text-left hover:border-emerald-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">{s}</span>
                  <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 group-hover:text-emerald-500">Click to search</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!quote && !error && !loading && watchlist.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-lg">Search for a ticker to see its quote</p>
          <p className="text-slate-300 dark:text-slate-600 text-sm mt-1">Try AAPL, MSFT, GOOGL, or any US stock symbol</p>
        </div>
      )}
    </div>
  );
}
