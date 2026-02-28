import { useSyncExternalStore } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Phone, MessageCircle } from 'lucide-react';
import {
  getCart, getCartTotal, getCartCount,
  updateCartItemQuantity, removeFromCart, clearCart,
  generateWhatsAppMessage, subscribeCart
} from '@/store/cartStore';
import type { CartItem } from '@/types/menu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cart = useSyncExternalStore(subscribeCart, getCart);
  const total = getCartTotal();
  const count = getCartCount();

  const handleWhatsApp = () => {
    const msg = generateWhatsAppMessage();
    window.open(`https://wa.me/905548273106?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#faf6f0] shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-[#3d2714] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#b87333] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>Sepetim</h2>
              <p className="text-[#c8b49a] text-xs">{count} ürün</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Cart Items */}
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
                <CartItemCard
                  key={`${item.product.id}-${index}`}
                  item={item}
                  index={index}
                />
              ))}

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-center text-sm text-red-500 hover:text-red-600 py-2 transition-colors"
                >
                  Sepeti Temizle
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer - Order Actions */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-t border-[#e8d5c0] p-4 space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between bg-[#3d2714] rounded-2xl p-4">
              <span className="text-[#c8b49a] font-medium">Toplam</span>
              <span className="text-2xl font-bold text-[#b87333]">
                {total.toLocaleString('tr-TR')} ₺
              </span>
            </div>

            {/* WhatsApp Order */}
            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-green-500/20 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile Sipariş Ver
            </button>

            {/* Phone Order */}
            <a
              href="tel:05548273106"
              className="w-full bg-[#b87333] hover:bg-[#a06828] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-[#b87333]/20 active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              Telefonla Sipariş Ver
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
    <div className="bg-white border border-[#e8d5c0] rounded-2xl overflow-hidden">
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          {item.product.image ? (
            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#f5ebe0] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#b87333]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#3d2714] text-sm truncate">{item.product.name}</h3>
          {opts.length > 0 && (
            <p className="text-[#9a8672] text-xs mt-0.5 truncate">
              {opts.map(([, choices]) => choices.join(', ')).join(' · ')}
            </p>
          )}
          <p className="text-[#b87333] font-bold text-sm mt-1">
            {subtotal.toLocaleString('tr-TR')} ₺
          </p>
        </div>

        {/* Delete */}
        <button
          onClick={() => removeFromCart(index)}
          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-end gap-2 px-3 pb-3">
        <div className="flex items-center gap-2 bg-[#f5ebe0] rounded-2xl p-0.5">
          <button
            onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
            className="w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:bg-[#e8d5c0] transition-colors shadow-sm"
          >
            <Minus className="w-3.5 h-3.5 text-[#3d2714]" />
          </button>
          <span className="text-sm font-bold w-6 text-center text-[#3d2714]">{item.quantity}</span>
          <button
            onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
            className="w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:bg-[#e8d5c0] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#3d2714]" />
          </button>
        </div>
      </div>
    </div>
  );
}
