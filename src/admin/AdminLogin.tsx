import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Coffee, Eye, EyeOff } from 'lucide-react';
import { login } from '@/store/authStore';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Yanlış şifre!');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3d2914] via-[#5d4037] to-[#4a3328] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#f5e6d3]">
            <span>DAFFY</span> <span className="text-[#f97316]">DARK</span>
          </h1>
          <p className="text-[#d4c4a8] text-sm mt-1">Yönetici Paneli</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#5d4037]/60 backdrop-blur-md border border-[#8b6f47]/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-[#f97316]" />
            <h2 className="text-lg font-semibold text-[#f5e6d3]">Giriş Yap</h2>
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
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 pr-12 text-[#f5e6d3] placeholder-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:border-[#f97316]/50 transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b6f47] hover:text-[#f5e6d3] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20"
          >
            Giriş Yap
          </button>

          <a
            href="/#/"
            className="block text-center text-[#8b6f47] hover:text-[#f97316] text-sm transition-colors mt-2"
          >
            ← Menüye Dön
          </a>
        </form>
      </div>
    </div>
  );
}
