import { useState } from 'react';
import { KeyRound, Save, Settings2 } from 'lucide-react';
import { updateAdminPassword } from '@/store/authStore';
import { getSettings, updateSettings } from '@/store/settingsStore';

export function SettingsPage() {
  const current = getSettings();

  const [deliveryFee, setDeliveryFee] = useState(String(current.deliveryFee));
  const [minOrderAmount, setMinOrderAmount] = useState(String(current.minOrderAmount));
  const [isOpen, setIsOpen] = useState(current.isOpen);
  const [whatsAppNumber, setWhatsAppNumber] = useState(current.whatsAppNumber);
  const [phoneNumber, setPhoneNumber] = useState(current.phoneNumber);
  const [restaurantName, setRestaurantName] = useState(current.restaurantName);
  const [restaurantAddress, setRestaurantAddress] = useState(current.restaurantAddress);
  const [orderMessageTemplate, setOrderMessageTemplate] = useState(current.orderMessageTemplate);

  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    const result = updateSettings({
      deliveryFee: Number(deliveryFee),
      minOrderAmount: Number(minOrderAmount),
      isOpen,
      whatsAppNumber,
      phoneNumber,
      restaurantName,
      restaurantAddress,
      orderMessageTemplate,
    });

    if (!result.ok) {
      setSettingsError(result.error || 'Ayarlar kaydedilemedi.');
      return;
    }

    setSettingsSuccess('Ayarlar başarıyla güncellendi.');
  };

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

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#f5e6d3]">Ayarlar</h1>
        <p className="text-[#d4c4a8] mt-1">Sipariş, iletişim ve panel ayarlarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="bg-[#5d4037]/60 border border-[#8b6f47]/25 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-[#f97316]" />
          <h2 className="text-lg font-semibold text-[#f5e6d3]">Sipariş ve Restoran Ayarları</h2>
        </div>

        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          {settingsError && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-4 py-2 rounded-xl">{settingsError}</div>
          )}

          {settingsSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm px-4 py-2 rounded-xl">{settingsSuccess}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#d4c4a8] mb-1.5">Teslimat Ücreti (₺)</label>
              <input type="number" min={0} step={1} value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" required />
            </div>
            <div>
              <label className="block text-sm text-[#d4c4a8] mb-1.5">Min. Sipariş Tutarı (₺)</label>
              <input type="number" min={0} step={1} value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" required />
            </div>
          </div>

          <label className="flex items-center gap-3 text-[#f5e6d3] bg-[#4a3328]/60 rounded-xl px-4 py-3">
            <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
            <span>Çalışma Durumu: {isOpen ? 'Açık' : 'Kapalı'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#d4c4a8] mb-1.5">WhatsApp Numarası</label>
              <input value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" placeholder="90555..." required />
            </div>
            <div>
              <label className="block text-sm text-[#d4c4a8] mb-1.5">Telefon Numarası</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" placeholder="0555..." required />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Restoran Adı</label>
            <input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" required />
          </div>

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Restoran Adresi</label>
            <input value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" required />
          </div>

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Sipariş Mesaj Şablonu</label>
            <textarea
              value={orderMessageTemplate}
              onChange={(e) => setOrderMessageTemplate(e.target.value)}
              rows={7}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]"
            />
            <p className="text-xs text-[#c8b49a] mt-1">Kullanılabilir alanlar: {'{{restaurantName}}'}, {'{{items}}'}, {'{{subtotal}}'}, {'{{deliveryFee}}'}, {'{{grandTotal}}'}, {'{{minOrderAmount}}'}</p>
          </div>

          <button type="submit" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-5 py-3 rounded-xl font-semibold">
            <Save className="w-4 h-4" />
            Ayarları Kaydet
          </button>
        </form>
      </div>

      <div className="bg-[#5d4037]/60 border border-[#8b6f47]/25 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-[#f97316]" />
          <h2 className="text-lg font-semibold text-[#f5e6d3]">Admin Şifresini Değiştir</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-4 py-2 rounded-xl">{passwordError}</div>}
          {passwordSuccess && <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm px-4 py-2 rounded-xl">{passwordSuccess}</div>}

          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Mevcut Şifre</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" required />
          </div>
          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Yeni Şifre</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm text-[#d4c4a8] mb-1.5">Yeni Şifre (Tekrar)</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/30 rounded-xl py-3 px-4 text-[#f5e6d3]" required minLength={6} />
          </div>

          <button type="submit" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-5 py-3 rounded-xl font-semibold">
            <Save className="w-4 h-4" />
            Şifreyi Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
