import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form.firstName, form.lastName, form.email, form.password);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Signup failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ];

  const inputClass = 'w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Start tracking stocks with TradeGate</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {fields.slice(0, 2).map((f) => (
                <div key={f.name}>
                  <label htmlFor={f.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    required
                    value={form[f.name]}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>

            {fields.slice(2).map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  required
                  value={form[f.name]}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={f.placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
