import { useState } from 'react';
import { KeyRound, Save, Truck } from 'lucide-react';
import { updateAdminPassword } from '@/store/authStore';
import { getDeliveryFee, setDeliveryFee } from '@/store/settingsStore';

export function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [deliveryFee, setDeliveryFeeInput] = useState(String(getDeliveryFee()));
  const [feeError, setFeeError] = useState('');
  const [feeSuccess, setFeeSuccess] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Yeni şifre ve tekrar şifresi eşleşmiyor.');
      return;
    }

    const result = updateAdminPassword(currentPassword, newPassword);
    if (!result.ok) {
      setPasswordError(result.error || 'Şifre güncellenemedi.');
      return;
    }

    setPasswordSuccess('Admin şifresi başarıyla güncellendi.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeeError('');
    setFeeSuccess('');

    const numericValue = Number(deliveryFee);
    const result = setDeliveryFee(numericValue);

    if (!result.ok) {
      setFeeError(result.error || 'Teslimat ücreti kaydedilemedi.');
      return;
    }

    setDeliveryFeeInput(String(Math.round(numericValue)));
    setFeeSuccess('Teslimat ücreti güncellendi.');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#f5e6d3]">Ayarlar</h1>
        <p className="text-[#d4c4a8] mt-1">Admin panel ayarlarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="bg-[#5d4037]/60 border border-[#8b6f47]/25 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-[#f97316]" />
          <h2 className="text-lg font-semibold text-[#f5e6d3]">Teslimat Ücreti</h2>
        </div>

        <form onSubmit={handleFeeSubmit} className="space-y-4">
          {feeError && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-4 py-2 rounded-xl">
              {feeError}
            </div>
          )}

          {feeSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm px-4 py-2 rounded-xl">
              {feeSuccess}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Teslimat Ücreti (₺)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={deliveryFee}
              onChange={(e) => setDeliveryFeeInput(e.target.value)}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3] placeholder-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20"
          >
            <Save className="w-4 h-4" />
            Kaydet
          </button>
        </form>
      </div>

      <div className="bg-[#5d4037]/60 border border-[#8b6f47]/25 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-[#f97316]" />
          <h2 className="text-lg font-semibold text-[#f5e6d3]">Admin Şifresini Değiştir</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-4 py-2 rounded-xl">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm px-4 py-2 rounded-xl">
              {passwordSuccess}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Mevcut Şifre</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3] placeholder-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3] placeholder-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3] placeholder-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20"
          >
            <Save className="w-4 h-4" />
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
