import { useState, useMemo, useEffect, useCallback, useSyncExternalStore } from 'react';
import type { Category, MenuItem, CategoryInfo } from '@/types/menu';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { CategoryNav } from '@/sections/CategoryNav';
import { MenuGrid, SearchGrid } from '@/sections/MenuGrid';
import { ProductModal } from '@/sections/ProductModal';
import { Footer } from '@/sections/Footer';
import { SearchBar } from '@/sections/SearchBar';
import { FloatingCartButton } from '@/sections/FloatingOrderButton';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { CartDrawer } from '@/sections/CartDrawer';
import { FloatingSearchButton } from '@/sections/FloatingSearchButton';
import { fetchMenuData } from '@/lib/api';
import { getSettings, subscribeSettings } from '@/store/settingsStore';
import { getCartCount, subscribeCart } from '@/store/cartStore';

function App() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('tatli');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const settings = useSyncExternalStore(subscribeSettings, getSettings);
  const cartCount = useSyncExternalStore(subscribeCart, getCartCount);

  useEffect(() => {
    fetchMenuData().then((data) => {
      setCategories(data.categories);
      setMenuItems(data.menuItems);
      if (data.categories.length > 0) setActiveCategory(data.categories[0].id);
    });
  }, []);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    categories.forEach((cat) => {
      grouped[cat.id] = menuItems.filter((item) => item.category === cat.id);
    });
    return grouped;
  }, [menuItems, categories]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return menuItems.filter((item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
  }, [searchQuery, menuItems]);

  const handleScroll = useCallback(() => {
    const headerOffset = 130;
    for (let i = categories.length - 1; i >= 0; i--) {
      const el = document.getElementById(`category-${categories[i].id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerOffset) {
          setActiveCategory(categories[i].id);
          return;
        }
      }
    }
    if (categories.length > 0) setActiveCategory(categories[0].id);
  }, [categories]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  const handleFloatingSearch = () => {
    const anchor = document.getElementById('search-anchor');
    const input = document.getElementById('menu-search-input') as HTMLInputElement | null;

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => input?.focus(), 250);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#1e0f00]">
      <Header />
      {!settings.isOpen && (
        <div className="bg-amber-100 border-b border-amber-200 text-amber-900">
          <div className="max-w-lg mx-auto px-5 py-2 text-sm font-medium">Şu an sipariş almıyoruz.</div>
        </div>
      )}
      <main className="pb-28">
        <Hero />
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        {!searchQuery && (
          <>
            <FeaturedProducts menuItems={menuItems} onProductClick={setSelectedProduct} />
            <CategoryNav categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <MenuGrid categories={categories} itemsByCategory={itemsByCategory} onProductClick={setSelectedProduct} />
          </>
        )}
        {searchQuery && (
          <>
            <div className="px-5 py-3"><div className="max-w-lg mx-auto"><p className="text-[#7a5c3e] text-sm">"{searchQuery}" için <span className="font-semibold text-[#3d2714]">{searchResults.length}</span> sonuç bulundu</p></div></div>
            <SearchGrid items={searchResults} onProductClick={setSelectedProduct} />
          </>
        )}
      </main>
      <Footer onCartOpen={() => setCartOpen(true)} />
      <FloatingCartButton onCartOpen={() => setCartOpen(true)} />
      <FloatingSearchButton hasCartBanner={cartCount > 0} onClick={handleFloatingSearch} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} onCartOpen={() => setCartOpen(true)} />
    </div>
  );
}

export default App;
