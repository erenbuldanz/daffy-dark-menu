import { ShoppingBag } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { getCartCount, getCartTotal, subscribeCart } from '@/store/cartStore';

interface FloatingCartButtonProps {
  onCartOpen: () => void;
}

export function FloatingCartButton({ onCartOpen }: FloatingCartButtonProps) {
  const count = useSyncExternalStore(subscribeCart, getCartCount);
  const total = useSyncExternalStore(subscribeCart, getCartTotal);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-5 pointer-events-none">
      <div className="max-w-lg mx-auto">
        <button
          onClick={onCartOpen}
          className="pointer-events-auto w-full bg-gradient-to-r from-[#c2874a] to-[#9f632b] hover:from-[#b9793d] hover:to-[#8d5523] text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-between transition-all duration-300 shadow-[0_14px_30px_rgba(159,99,43,0.38)] active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#9f632b] text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            </div>
            <span className="text-sm">Sepeti Görüntüle</span>
          </div>
          <span className="text-base font-bold">{total.toLocaleString('tr-TR')} ₺</span>
        </button>
      </div>
    </div>
  );
}
