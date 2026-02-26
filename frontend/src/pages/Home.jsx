import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Real-Time Quotes',
      desc: 'Get live stock prices powered by Finnhub market data.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Search Any Stock',
      desc: 'Look up any ticker symbol and view detailed price data instantly.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure Access',
      desc: 'JWT-authenticated sessions keep your account safe.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-blue-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Markets are live</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Trade Smarter with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                TradeGate
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Your gateway to real-time stock market data. Search any ticker, track prices, and stay
              ahead of the market — all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-center"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-center"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
