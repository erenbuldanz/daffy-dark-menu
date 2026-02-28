import { Coffee, ShoppingBag } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { getCartCount, subscribeCart } from '@/store/cartStore';

interface FooterProps {
  onCartOpen: () => void;
}

export function Footer({ onCartOpen }: FooterProps) {
  const cartCount = useSyncExternalStore(subscribeCart, getCartCount);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md tab-bar-shadow border-t border-[#eadcca]">
      <div className="max-w-lg mx-auto px-6 py-2">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-0.5 py-2 px-6 text-[#9f632b]">
            <Coffee className="w-5 h-5" />
            <span className="text-[10px] font-medium">Menü</span>
          </button>

          <button
            onClick={onCartOpen}
            className="flex flex-col items-center gap-0.5 py-2 px-6 text-[#9a8672] hover:text-[#9f632b] transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-[#9f632b] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-medium">Sepet</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
