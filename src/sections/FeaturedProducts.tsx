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
        <h2 className="text-lg font-bold text-[#3d2714] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Popüler</h2>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {featuredItems.map((item) => (
            <div key={item.id} onClick={() => onProductClick(item)} className="group flex-shrink-0 w-36 cursor-pointer">
              <div className="rounded-3xl overflow-hidden card-dark-gradient shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-28 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1408] via-transparent to-transparent" />
                </div>
                <div className="p-2.5 pt-2 text-center">
                  <h3 className="text-white font-medium text-xs line-clamp-1 mb-1">{item.name}</h3>
                  <p className="text-[#b87333] font-bold text-xs">{item.price.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
