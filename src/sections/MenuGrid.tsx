import type { MenuItem, CategoryInfo } from '@/types/menu';
import { Plus } from 'lucide-react';

interface MenuGridProps {
  categories: CategoryInfo[];
  itemsByCategory: Record<string, MenuItem[]>;
  onProductClick: (item: MenuItem) => void;
}

function ProductCard({ item, onProductClick, index }: { item: MenuItem; onProductClick: (item: MenuItem) => void; index: number }) {
  return (
    <div onClick={() => onProductClick(item)} className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${index * 55}ms` }}>
      <div className="relative rounded-3xl overflow-hidden bg-white border border-[#ecdcca] shadow-[0_10px_24px_rgba(30,15,0,0.08)] hover:shadow-[0_14px_32px_rgba(30,15,0,0.14)] transition-all duration-300">
        <div className="relative h-36 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
        <div className="px-3 pt-3 pb-4 bg-gradient-to-b from-[#fffdfa] to-[#fdf6ec]">
          <h3 className="text-[#2f1b0e] font-semibold text-sm line-clamp-1 mb-1">{item.name}</h3>
          <p className="text-[#866648] text-xs line-clamp-1 mb-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-[#b87333] font-bold text-sm">{item.price.toLocaleString('tr-TR')} ₺</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(item);
              }}
              className="w-8 h-8 bg-gradient-to-br from-[#c2874a] to-[#a96a2e] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuGrid({ categories, itemsByCategory, onProductClick }: MenuGridProps) {
  return (
    <div className="px-5 py-3">
      <div className="max-w-lg mx-auto space-y-8">
        {categories.map((category) => {
          const items = itemsByCategory[category.id] || [];
          if (items.length === 0) return null;

          return (
            <section key={category.id} id={`category-${category.id}`}>
              <h3 className="text-xl font-bold text-[#2f1b0e] mb-3">{category.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                {items.map((item, index) => (
                  <ProductCard key={item.id} item={item} onProductClick={onProductClick} index={index} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

interface SearchGridProps {
  items: MenuItem[];
  onProductClick: (item: MenuItem) => void;
}

export function SearchGrid({ items, onProductClick }: SearchGridProps) {
  if (items.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <div className="w-20 h-20 bg-[#f5ebe0] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <p className="text-[#3d2714] font-medium">Sonuç bulunamadı</p>
        <p className="text-[#9a8672] text-sm mt-1">Farklı bir arama deneyin</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-3">
      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <ProductCard key={item.id} item={item} onProductClick={onProductClick} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
