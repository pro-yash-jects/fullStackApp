import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../api/axios';

export default function StockCard({ symbol, data }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, token } = useAuth();
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartDays, setChartDays] = useState(7);
  const [chartLoading, setChartLoading] = useState(false);

  const inWatchlist = isInWatchlist(symbol);
  const isPositive = data.d >= 0;
  const changeColor = isPositive ? 'text-emerald-400' : 'text-red-400';
  const changeBg = isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';
  const arrow = isPositive ? '▲' : '▼';

  const stats = [
    { label: 'Open', value: data.open },
    { label: 'High', value: data.high },
    { label: 'Low', value: data.low },
    { label: 'Prev Close', value: data.previous_close },
  ];

  useEffect(() => {
    fetchChart();

  }, [symbol, chartDays]);

  const fetchChart = async () => {
    setChartLoading(true);
    try {
      const res = await api.get(`/stocks/history/${symbol}?days=${chartDays}`);
      console.log(res)
      setChartData(res.data || []);
    } catch {
      // Backend endpoint may not exist yet — generate placeholder from current data
      // const points = [];
      // const base = data.pc || data.c;
      // for (let i = chartDays; i >= 0; i--) {
      //   const d = new Date();
      //   d.setDate(d.getDate() - i);
      //   const variance = (Math.random() - 0.5) * (base * 0.04);
      //   points.push({
      //     date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      //     price: +(base + variance).toFixed(2),
      //   });
      // }
      // Set last point to current price
      // points[points.length - 1].price = data.c;
      // setChartData(points);
      console.log("Error fetching chart data");
    } finally {
      setChartLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      if (inWatchlist) await removeFromWatchlist(symbol);
      else await addToWatchlist(symbol);
    } catch {
      // silent — backend may not be ready
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{symbol}</h2>
            {token && (
              <button
                onClick={toggleWatchlist}
                disabled={watchlistLoading}
                className="cursor-pointer"
                title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <svg
                  className={`w-6 h-6 transition-colors ${inWatchlist ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 dark:text-slate-500'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill={inWatchlist ? 'currentColor' : 'none'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time quote</p>
        </div>
        <div className={`${changeBg} ${changeColor} px-3 py-1 rounded-full text-sm font-medium`}>
          {arrow} {data.dp?.toFixed(2)}%
        </div>
      </div>

      {/* Current price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">${data.c?.toFixed(2)}</span>
        <span className={`ml-3 text-lg font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{data.d?.toFixed(2)}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">{stat.label}</p>
            <p className="text-slate-900 dark:text-white font-semibold mt-1">${parseFloat(stat.value).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Price History</p>
          <div className="flex gap-1">
            {[7, 30].map((d) => (
              <button
                key={d}
                onClick={() => setChartDays(d)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  chartDays === d
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
        {chartLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} stroke="#64748b" axisLine={false} tickLine={false} width={60} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.75rem', color: '#f1f5f9', fontSize: 13 }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Area type="monotone" dataKey="price" stroke={isPositive ? '#10b981' : '#ef4444'} fill="url(#priceGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Buy / Sell quick actions */}
      {token && (
        <div className="flex gap-3">
          <a
            href="/transactions"
            className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Buy {symbol}
          </a>
          <a
            href="/transactions"
            className="flex-1 text-center bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Sell {symbol}
          </a>
        </div>
      )}
    </div>
  );
}
