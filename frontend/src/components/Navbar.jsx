import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, watchlist } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'Admin';

  const navLink = 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2';

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TG</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">TradeGate</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className={navLink}>Dashboard</Link>
                <Link to="/transactions" className={navLink}>Trade</Link>
                {isAdmin && (
                  <Link to="/admin" className={navLink}>Admin</Link>
                )}

                {/* Watchlist count */}
                <Link to="/dashboard" className="relative px-2 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Watchlist">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {watchlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {watchlist.length}
                    </span>
                  )}
                </Link>

                <span className="text-slate-400 dark:text-slate-400 text-sm">
                  Hi, {user.firstName}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className={navLink}>Login</Link>
                <Link
                  to="/signup"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`block ${navLink}`}>Dashboard</Link>
                <Link to="/transactions" onClick={() => setMenuOpen(false)} className={`block ${navLink}`}>Trade</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className={`block ${navLink}`}>Admin</Link>}
                <div className="text-slate-400 text-sm px-3 py-2">Hi, {user.firstName} · Watchlist: {watchlist.length}</div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className={`block w-full text-left ${navLink} cursor-pointer`}
                >Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className={`block ${navLink}`}>Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className={`block ${navLink}`}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
