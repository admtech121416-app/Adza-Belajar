import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(username, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-300 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center text-lg font-black text-slate-900 uppercase bg-rose-400 hover:bg-rose-300 border-4 border-slate-900 py-2 px-4 rounded-xl shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a] transition-all"
        >
          <ArrowLeft className="w-6 h-6 mr-2 stroke-[3px]" />
          Kembali
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[8px_8px_0_0_#0f172a] border-4 border-slate-900 p-8 transform rotate-1">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-4 border-slate-900 rounded-[2rem] mb-4 shadow-[4px_4px_0_0_#0f172a] transform -rotate-6 p-2">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Administrator</h1>
          <p className="text-slate-600 font-bold mt-2">Masuk untuk mengelola Adza Belajar</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-400 border-4 border-slate-900 text-slate-900 rounded-xl text-lg font-black shadow-[4px_4px_0_0_#0f172a]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-lg font-black text-slate-900 uppercase mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-900">
                <User className="h-6 w-6 stroke-[3px]" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-white border-4 border-slate-900 rounded-2xl focus:outline-none focus:ring-0 font-black text-lg text-slate-900 placeholder-slate-400 shadow-[4px_4px_0_0_#0f172a] transition-transform focus:-translate-y-1"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-black text-slate-900 uppercase mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-900">
                <Lock className="h-6 w-6 stroke-[3px]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-14 py-4 bg-white border-4 border-slate-900 rounded-2xl focus:outline-none focus:ring-0 font-black text-lg text-slate-900 placeholder-slate-400 shadow-[4px_4px_0_0_#0f172a] transition-transform focus:-translate-y-1"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-900 hover:scale-110 transition-transform"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-6 w-6 stroke-[3px]" /> : <Eye className="h-6 w-6 stroke-[3px]" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-400 hover:bg-emerald-300 border-4 border-slate-900 text-slate-900 font-black text-xl py-4 px-6 rounded-2xl shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a] transition-all mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center uppercase"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
