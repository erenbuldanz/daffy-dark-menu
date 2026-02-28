import { useSyncExternalStore } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Phone, MessageCircle, AlertCircle } from 'lucide-react';
import {
  getCart,
  getCartTotal,
  getCartCount,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  generateWhatsAppMessage,
  subscribeCart,
} from '@/store/cartStore';
import type { CartItem } from '@/types/menu';
import { getSettings, subscribeSettings } from '@/store/settingsStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cart = useSyncExternalStore(subscribeCart, getCart);
  const total = getCartTotal();
  const count = getCartCount();
  const settings = useSyncExternalStore(subscribeSettings, getSettings);

  const deliveryFee = settings.deliveryFee;
  const grandTotal = total + deliveryFee;
  const meetsMinOrder = total >= settings.minOrderAmount;
  const canOrder = settings.isOpen && meetsMinOrder;

  const handleWhatsApp = () => {
    const latest = getSettings();
    const latestSubtotal = getCartTotal();
    const latestCanOrder = latest.isOpen && latestSubtotal >= latest.minOrderAmount;

    if (!latestCanOrder) {
      alert(!latest.isOpen ? 'Şu anda sipariş alımı kapalı.' : `Minimum sipariş tutarı ${latest.minOrderAmount.toLocaleString('tr-TR')} ₺`);
      return;
    }

    const msg = generateWhatsAppMessage();
    const number = latest.whatsAppNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-b from-[#fffdf9] via-[#fbf4e9] to-[#f7ecdc] shadow-2xl flex flex-col animate-slide-in-right">
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0 border-b border-[#eadcca] bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c2874a] to-[#9f632b] rounded-xl flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[#2b170b] text-lg">Sepetim</h2>
              <p className="text-[#9b7a57] text-xs">{count} ürün</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white border border-[#eadcca] rounded-full flex items-center justify-center hover:bg-[#f8efe3] transition-colors">
            <X className="w-5 h-5 text-[#5d4027]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-[#f5ebe0] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-[#b87333]" />
              </div>
              <p className="text-[#3d2714] font-medium mb-1">Sepetiniz boş</p>
              <p className="text-[#9a8672] text-sm">Menüden ürün ekleyerek başlayın</p>
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <CartItemCard key={`${item.product.id}-${index}`} item={item} index={index} />
              ))}
              <button onClick={clearCart} className="w-full text-center text-sm text-red-500 hover:text-red-600 py-2 transition-colors">
                Sepeti Temizle
              </button>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-t border-[#e8d5c0] p-4 space-y-3">
            {!settings.isOpen && (
              <div className="flex items-start gap-2 bg-amber-100 text-amber-900 rounded-xl p-3 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5" />Şu anda sipariş alımı kapalı.
              </div>
            )}

            {settings.minOrderAmount > 0 && !meetsMinOrder && (
              <div className="flex items-start gap-2 bg-amber-100 text-amber-900 rounded-xl p-3 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                Minimum sipariş tutarı {settings.minOrderAmount.toLocaleString('tr-TR')} ₺. Kalan tutar: {(settings.minOrderAmount - total).toLocaleString('tr-TR')} ₺
              </div>
            )}

            <div className="bg-[#2f1b0e] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between"><span className="text-[#d9c3a8] font-medium">Ara Toplam</span><span className="text-lg font-bold text-[#fff4e8]">{total.toLocaleString('tr-TR')} ₺</span></div>
              <div className="flex items-center justify-between"><span className="text-[#d9c3a8] font-medium">Teslimat Ücreti</span><span className="text-lg font-bold text-[#fff4e8]">{deliveryFee.toLocaleString('tr-TR')} ₺</span></div>
              <div className="h-px bg-[#8b6f47]/40" />
              <div className="flex items-center justify-between"><span className="text-[#d9c3a8] font-medium">Genel Toplam</span><span className="text-2xl font-bold text-[#d39b5e]">{grandTotal.toLocaleString('tr-TR')} ₺</span></div>
            </div>

            <button
              onClick={handleWhatsApp}
              disabled={!canOrder}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-green-500/20 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />WhatsApp ile Sipariş Ver
            </button>

            <a
              href={canOrder ? `tel:${settings.phoneNumber}` : undefined}
              onClick={(e) => {
                const latest = getSettings();
                const latestSubtotal = getCartTotal();
                const latestCanOrder = latest.isOpen && latestSubtotal >= latest.minOrderAmount;
                if (!latestCanOrder) {
                  e.preventDefault();
                  alert(!latest.isOpen ? 'Şu anda sipariş alımı kapalı.' : `Minimum sipariş tutarı ${latest.minOrderAmount.toLocaleString('tr-TR')} ₺`);
                }
              }}
              className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${
                canOrder ? 'premium-cta text-white shadow-lg shadow-[#9f632b]/25 active:scale-[0.98]' : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              <Phone className="w-5 h-5" />Telefonla Sipariş Ver
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItemCard({ item, index }: { item: CartItem; index: number }) {
  const subtotal = item.product.price * item.quantity;
  const opts = Object.entries(item.selectedOptions).filter(([, v]) => v.length > 0);

  return (
    <div className="bg-white border border-[#eadcca] rounded-2xl overflow-hidden shadow-[0_8px_18px_rgba(30,15,0,0.06)]">
      <div className="flex gap-3 p-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#f5ebe0] flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-[#b87333]" /></div>}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#2f1b0e] text-sm truncate">{item.product.name}</h3>
          {opts.length > 0 && <p className="text-[#9a8672] text-xs mt-0.5 truncate">{opts.map(([, choices]) => choices.join(', ')).join(' · ')}</p>}
          <p className="text-[#b87333] font-bold text-sm mt-1">{subtotal.toLocaleString('tr-TR')} ₺</p>
        </div>

        <button onClick={() => removeFromCart(index)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 px-3 pb-3">
        <div className="flex items-center gap-2 bg-[#f8efe3] rounded-2xl p-0.5">
          <button onClick={() => updateCartItemQuantity(index, item.quantity - 1)} className="w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:bg-[#f1e3d1] transition-colors shadow-sm"><Minus className="w-3.5 h-3.5 text-[#3d2714]" /></button>
          <span className="text-sm font-bold w-6 text-center text-[#3d2714]">{item.quantity}</span>
          <button onClick={() => updateCartItemQuantity(index, item.quantity + 1)} className="w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:bg-[#f1e3d1] transition-colors shadow-sm"><Plus className="w-3.5 h-3.5 text-[#3d2714]" /></button>
        </div>
      </div>
    </div>
  );
}
