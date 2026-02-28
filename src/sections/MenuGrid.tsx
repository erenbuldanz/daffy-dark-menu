import type { MenuItem, CategoryInfo } from '@/types/menu';
import { Plus } from 'lucide-react';

interface MenuGridProps {
  categories: CategoryInfo[];
  itemsByCategory: Record<string, MenuItem[]>;
  onProductClick: (item: MenuItem) => void;
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
              {/* Kategori Başlığı */}
              <h3 className="text-lg font-bold text-[#3d2714] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                {category.name}
              </h3>

              {/* Ürün Grid */}
              <div className="grid grid-cols-2 gap-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => onProductClick(item)}
                    className="group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="relative rounded-3xl overflow-hidden card-dark-gradient shadow-lg hover:shadow-xl transition-shadow duration-300">
                      {/* Ürün Görseli */}
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1408] via-transparent to-transparent" />
                      </div>

                      {/* İçerik */}
                      <div className="px-3 pt-3 pb-4">
                        <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-[#9a8672] text-xs line-clamp-1 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-sm">
                            {item.price.toLocaleString('tr-TR')} ₺
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onProductClick(item);
                            }}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                          >
                            <Plus className="w-4 h-4 text-[#3d2714]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* Arama sonuçları için ayrı grid */
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
            <div
              key={item.id}
              onClick={() => onProductClick(item)}
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative rounded-3xl overflow-hidden card-dark-gradient shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1408] via-transparent to-transparent" />
                </div>
                <div className="px-3 pt-3 pb-4">
                  <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[#9a8672] text-xs line-clamp-1 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm">
                      {item.price.toLocaleString('tr-TR')} ₺
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(item);
                      }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                    >
                      <Plus className="w-4 h-4 text-[#3d2714]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
