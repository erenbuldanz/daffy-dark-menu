import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Coffee, Eye, EyeOff } from 'lucide-react';
import { login } from '@/store/authStore';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(password);
    setLoading(false);

    if (ok) {
      navigate('/admin');
    } else {
      setError('Yanlış şifre!');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            <span>DAFFY</span> <span className="text-amber-600">DARK</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">Yönetici Paneli</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white backdrop-blur-md border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-900">Giriş Yap</h2>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Şifre"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 pr-12 text-slate-900 placeholder-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:border-[#f97316]/50 transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-[#ea580c] hover:to-[#c2410c] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-amber-500/20"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>

          <a
            href="/#/"
            className="block text-center text-slate-500 hover:text-amber-600 text-sm transition-colors mt-2"
          >
            ← Menüye Dön
          </a>
        </form>
      </div>
    </div>
  );
}
