import { useState, useEffect } from 'react';
import type { MenuItem } from '@/types/menu';
import { ArrowLeft, Minus, Plus, Check, ShoppingBag } from 'lucide-react';
import { addToCart } from '@/store/cartStore';

interface ProductModalProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCartOpen: () => void;
}

const MAX_QUANTITY = 20;

export function ProductModal({ product, isOpen, onClose, onCartOpen }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedOptions({});
      setAdded(false);
    }
  }, [isOpen, product]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!product || !isOpen) return null;

  const totalPrice = product.price * quantity;

  const handleOptionToggle = (optionName: string, choice: string) => {
    setSelectedOptions((prev) => {
      const current = prev[optionName] || [];
      const option = product.options?.find((o) => o.name === optionName);
      const maxSelect = option?.maxSelect || 1;

      if (current.includes(choice)) {
        return { ...prev, [optionName]: current.filter((c) => c !== choice) };
      }
      if (current.length < maxSelect) {
        return { ...prev, [optionName]: [...current, choice] };
      }
      return prev;
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions);
    setAdded(true);
    setTimeout(() => {
      onClose();
      setTimeout(() => onCartOpen(), 220);
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-[70] animate-fade-in-up" style={{ animationDuration: '0.25s' }}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#fffdf9] via-[#fbf4e9] to-[#f7ecdc] max-w-lg mx-auto w-full relative">
          <div className="relative h-80 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b170b]/65 via-[#2b170b]/20 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-10 h-10 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors z-10 shadow-md"
            >
              <ArrowLeft className="w-5 h-5 text-[#2b170b]" />
            </button>

            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-white/80 text-[11px] tracking-[0.18em] uppercase">Premium Seçim</p>
              <h2 className="font-serif text-[30px] text-white leading-tight drop-shadow-md">{product.name}</h2>
            </div>
          </div>

          <div className="px-5 pt-5 pb-32 space-y-5">
            <div className="bg-white/85 border border-[#eadcca] rounded-2xl p-4 shadow-[0_8px_24px_rgba(30,15,0,0.08)] flex items-center justify-between">
              <span className="text-[#7b5a3d] text-sm">Birim Fiyat</span>
              <span className="text-[#2b170b] text-xl font-bold">{product.price.toLocaleString('tr-TR')} ₺</span>
            </div>

            {product.options?.map((option) => (
              <div key={option.name} className="bg-white/85 border border-[#eadcca] rounded-2xl p-4 shadow-[0_8px_24px_rgba(30,15,0,0.06)]">
                <h4 className="font-semibold text-[#2f1b0e] mb-3">{option.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {option.choices.map((choice) => {
                    const isSelected = selectedOptions[option.name]?.includes(choice);
                    return (
                      <button
                        key={choice}
                        onClick={() => handleOptionToggle(option.name, choice)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'premium-cta text-white shadow-md'
                            : 'bg-[#f8efe3] text-[#6e5135] hover:bg-[#f1e3d1]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="bg-white/85 border border-[#eadcca] rounded-2xl p-4 shadow-[0_8px_24px_rgba(30,15,0,0.06)]">
              <h4 className="font-semibold text-[#2f1b0e] mb-2">Hakkında</h4>
              <p className="text-[#70543a] text-sm leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center justify-between bg-white/85 border border-[#eadcca] rounded-2xl p-4 shadow-[0_8px_24px_rgba(30,15,0,0.06)]">
              <span className="text-[#70543a] text-sm font-medium">Adet</span>
              <div className="flex items-center gap-2 bg-[#f8efe3] rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-[#f3e7d8] transition-colors">
                  <Minus className="w-4 h-4 text-[#2f1b0e]" />
                </button>
                <span className="text-base font-bold w-6 text-center text-[#2f1b0e]">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-[#f3e7d8] transition-colors">
                  <Plus className="w-4 h-4 text-[#2f1b0e]" />
                </button>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-[80] bg-[#fffdfa]/95 backdrop-blur-md border-t border-[#eadcca] px-5 py-4">
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <button className="w-12 h-12 bg-[#f4e5d1] rounded-2xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-[#8f5a2a]" />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-[0.98] text-sm ${
                  added
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                    : 'premium-cta text-white shadow-[#9f632b]/30'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Sepete Eklendi
                  </>
                ) : (
                  <>Sepete Ekle — {totalPrice.toLocaleString('tr-TR')} ₺</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
