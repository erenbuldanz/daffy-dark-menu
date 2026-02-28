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

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
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
      setTimeout(() => onCartOpen(), 200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[70] animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 overflow-y-auto bg-[#faf6f0] max-w-lg mx-auto w-full relative">
          {/* Hero Image */}
          <div className="relative h-72 overflow-hidden" style={{
            background: 'linear-gradient(180deg, #3d2714 0%, #2a1a0e 100%)'
          }}>
            {/* Dekoratif coffee bean desen */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="absolute top-8 right-8 w-20 h-20 text-[#b87333]/30" viewBox="0 0 100 100" fill="currentColor">
                <ellipse cx="50" cy="50" rx="40" ry="25" transform="rotate(-30 50 50)" />
              </svg>
              <svg className="absolute top-20 left-4 w-14 h-14 text-[#b87333]/20" viewBox="0 0 100 100" fill="currentColor">
                <ellipse cx="50" cy="50" rx="40" ry="25" transform="rotate(45 50 50)" />
              </svg>
              <svg className="absolute bottom-8 right-16 w-10 h-10 text-[#b87333]/15" viewBox="0 0 100 100" fill="currentColor">
                <ellipse cx="50" cy="50" rx="40" ry="25" transform="rotate(-15 50 50)" />
              </svg>
            </div>

            {/* Ürün görseli */}
            <div className="absolute inset-0 flex items-center justify-center pt-8">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#b87333]/20 shadow-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Geri butonu */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/25 transition-colors z-10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* İçerik */}
          <div className="px-6 pt-5 pb-32">
            {/* İsim ve Fiyat */}
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#3d2714] flex-1 pr-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                {product.name}
              </h2>
              <span className="text-xl font-bold text-[#3d2714] whitespace-nowrap">
                {product.price.toLocaleString('tr-TR')} ₺
              </span>
            </div>

            {/* Seçenekler */}
            {product.options?.map((option) => (
              <div key={option.name} className="mb-5">
                <h4 className="font-bold text-[#3d2714] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {option.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {option.choices.map((choice) => {
                    const isSelected = selectedOptions[option.name]?.includes(choice);
                    return (
                      <button
                        key={choice}
                        onClick={() => handleOptionToggle(option.name, choice)}
                        className={`
                          px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5
                          ${isSelected
                            ? 'bg-[#b87333] text-white shadow-md shadow-[#b87333]/20'
                            : 'bg-[#f5ebe0] text-[#7a5c3e] hover:bg-[#e8d5c0]'
                          }
                        `}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Hakkında */}
            <div className="mb-5">
              <h4 className="font-bold text-[#3d2714] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Hakkında
              </h4>
              <p className="text-[#7a5c3e] text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Adet Seçimi */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[#7a5c3e] text-sm font-medium">Adet</span>
              <div className="flex items-center gap-3 bg-[#f5ebe0] rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-[#e8d5c0] transition-colors shadow-sm"
                >
                  <Minus className="w-4 h-4 text-[#3d2714]" />
                </button>
                <span className="text-lg font-bold w-6 text-center text-[#3d2714]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-[#e8d5c0] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#3d2714]" />
                </button>
              </div>
            </div>
          </div>

          {/* Alt Buton - Sabit */}
          <div className="fixed bottom-0 left-0 right-0 z-[80] bg-[#faf6f0]/95 backdrop-blur-md border-t border-[#e8d5c0] px-5 py-4">
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <button className="w-12 h-12 bg-[#f5ebe0] rounded-2xl flex items-center justify-center flex-shrink-0 hover:bg-[#e8d5c0] transition-colors">
                <ShoppingBag className="w-5 h-5 text-[#3d2714]" />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-[0.98] text-sm ${
                  added
                    ? 'bg-green-500 text-white shadow-green-500/20'
                    : 'bg-[#b87333] hover:bg-[#a06828] text-white shadow-[#b87333]/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Sepete Eklendi!
                  </>
                ) : (
                  <>
                    Sepete Ekle — {totalPrice.toLocaleString('tr-TR')} ₺
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
