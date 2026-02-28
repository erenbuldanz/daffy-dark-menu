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
          className="pointer-events-auto w-full bg-[#b87333] hover:bg-[#a06828] text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-between transition-all duration-300 shadow-xl shadow-[#b87333]/30 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#b87333] text-[10px] font-bold rounded-full flex items-center justify-center">
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
