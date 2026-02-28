import type { Category, CategoryInfo } from '@/types/menu';
import { Cake, GlassWater, Coffee, Snowflake } from 'lucide-react';

interface CategoryNavProps {
  categories: CategoryInfo[];
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const iconMap: Record<string, typeof Cake> = {
  Cake,
  GlassWater,
  Coffee,
  Snowflake,
};

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  const handleClick = (categoryId: string) => {
    onCategoryChange(categoryId);
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      const headerOffset = 120;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[72px] z-30 bg-[#fdf9f3]/90 backdrop-blur-md border-b border-[#eadcca]">
      <div className="px-5 pt-2 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Coffee;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleClick(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 text-sm font-semibold tracking-[0.01em] ${
                    isActive
                      ? 'premium-cta text-white shadow-lg shadow-[#b87333]/25'
                      : 'bg-white text-[#6f5236] border border-[#ecdcca] hover:bg-[#fbf1e3]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
