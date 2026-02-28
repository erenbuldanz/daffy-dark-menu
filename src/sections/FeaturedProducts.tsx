import type { MenuItem } from '@/types/menu';

interface FeaturedProductsProps {
  menuItems: MenuItem[];
  onProductClick: (item: MenuItem) => void;
}

export function FeaturedProducts({ menuItems, onProductClick }: FeaturedProductsProps) {
  const featuredItems = [...menuItems].sort((a, b) => b.price - a.price).slice(0, 5);

  return (
    <div className="px-5 py-3">
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-[#2b170b] mb-3 text-premium-title">Öne Çıkanlar</h2>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {featuredItems.map((item) => (
            <div key={item.id} onClick={() => onProductClick(item)} className="group flex-shrink-0 w-40 cursor-pointer">
              <div className="rounded-3xl overflow-hidden bg-white border border-[#ecdcca] shadow-[0_8px_20px_rgba(30,15,0,0.08)] hover:shadow-[0_10px_28px_rgba(30,15,0,0.12)] transition-all duration-300 premium-hover">
                <div className="relative h-28 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-3 pt-2.5">
                  <h3 className="text-[#2f1b0e] font-semibold text-sm line-clamp-1 mb-1">{item.name}</h3>
                  <p className="text-[#b87333] font-bold text-sm">{item.price.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
