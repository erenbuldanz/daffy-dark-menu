import { useEffect, useState } from 'react';
import { Package, Grid3X3, TrendingUp, DollarSign, Star, BarChart3 } from 'lucide-react';
import { fetchMenuData } from '@/lib/api';
import type { CategoryInfo, MenuItem } from '@/types/menu';

export function DashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    fetchMenuData().then((d) => {
      setItems(d.menuItems);
      setCategories(d.categories);
    });
  }, []);

  const totalProducts = items.length;
  const totalCategories = categories.length;
  const avgPrice = items.length > 0 ? Math.round(items.reduce((s, i) => s + i.price, 0) / items.length) : 0;
  const maxPrice = items.length > 0 ? Math.max(...items.map(i => i.price)) : 0;
  const minPrice = items.length > 0 ? Math.min(...items.map(i => i.price)) : 0;

  const categoryStats = categories.map(cat => {
    const catItems = items.filter(i => i.category === cat.id);
    const catAvg = catItems.length > 0 ? Math.round(catItems.reduce((s, i) => s + i.price, 0) / catItems.length) : 0;
    return { ...cat, count: catItems.length, avg: catAvg };
  });

  const topProducts = [...items].sort((a, b) => b.price - a.price).slice(0, 5);

  return <div className="max-w-5xl mx-auto space-y-6">{/* same UI */}
    <div><h1 className="text-2xl font-bold text-[#f5e6d3] flex items-center gap-2"><BarChart3 className="w-6 h-6 text-[#f97316]" />Gösterge Paneli</h1><p className="text-[#8b6f47] text-sm mt-1">Menü istatistiklerinize genel bakış</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Package} label="Toplam Ürün" value={totalProducts.toString()} color="orange" />
      <StatCard icon={Grid3X3} label="Kategori" value={totalCategories.toString()} color="blue" />
      <StatCard icon={DollarSign} label="Ort. Fiyat" value={`${avgPrice} ₺`} color="green" />
      <StatCard icon={TrendingUp} label="En Yüksek" value={`${maxPrice} ₺`} color="purple" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#5d4037]/40 backdrop-blur-sm border border-[#8b6f47]/20 rounded-2xl p-5"><h3 className="text-lg font-semibold text-[#f5e6d3] mb-4 flex items-center gap-2"><Grid3X3 className="w-5 h-5 text-[#f97316]" />Kategori Dağılımı</h3><div className="space-y-3">{categoryStats.map(cat => { const pct = totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0; return <div key={cat.id}><div className="flex items-center justify-between mb-1.5"><span className="text-[#d4c4a8] text-sm font-medium">{cat.name}</span><span className="text-[#8b6f47] text-xs">{cat.count} ürün • Ort: {cat.avg} ₺</span></div><div className="w-full h-2.5 bg-[#4a3328] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} /></div></div>;})}</div></div>
      <div className="bg-[#5d4037]/40 backdrop-blur-sm border border-[#8b6f47]/20 rounded-2xl p-5"><h3 className="text-lg font-semibold text-[#f5e6d3] mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-[#f97316]" />En Pahalı Ürünler</h3><div className="space-y-3">{topProducts.map((item, i) => <div key={item.id} className="flex items-center gap-3 bg-[#4a3328]/50 rounded-xl p-3"><span className="w-7 h-7 bg-[#f97316]/20 text-[#f97316] rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span><div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">{item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#8b6f47]/20 flex items-center justify-center"><Package className="w-4 h-4 text-[#8b6f47]" /></div>}</div><div className="flex-1 min-w-0"><p className="text-[#f5e6d3] text-sm font-medium truncate">{item.name}</p><p className="text-[#8b6f47] text-xs">{categories.find(c => c.id === item.category)?.name || item.category}</p></div><span className="text-[#f97316] font-bold text-sm flex-shrink-0">{item.price} ₺</span></div>)}</div></div>
    </div>
    <div className="bg-[#5d4037]/40 backdrop-blur-sm border border-[#8b6f47]/20 rounded-2xl p-5"><h3 className="text-lg font-semibold text-[#f5e6d3] mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-[#f97316]" />Fiyat Aralığı</h3><div className="flex items-center gap-4"><div className="flex-1 text-center bg-[#4a3328]/50 rounded-xl p-4"><p className="text-[#8b6f47] text-xs mb-1">En Düşük</p><p className="text-[#f5e6d3] text-xl font-bold">{minPrice} ₺</p></div><div className="flex-1 text-center bg-[#4a3328]/50 rounded-xl p-4"><p className="text-[#8b6f47] text-xs mb-1">Ortalama</p><p className="text-[#f97316] text-xl font-bold">{avgPrice} ₺</p></div><div className="flex-1 text-center bg-[#4a3328]/50 rounded-xl p-4"><p className="text-[#8b6f47] text-xs mb-1">En Yüksek</p><p className="text-[#f5e6d3] text-xl font-bold">{maxPrice} ₺</p></div></div></div>
  </div>;
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = { orange: 'from-[#f97316] to-[#ea580c]', blue: 'from-blue-500 to-blue-600', green: 'from-emerald-500 to-emerald-600', purple: 'from-purple-500 to-purple-600' };
  return <div className="bg-[#5d4037]/40 backdrop-blur-sm border border-[#8b6f47]/20 rounded-2xl p-4"><div className={`w-10 h-10 bg-gradient-to-br ${colorMap[color]} rounded-xl flex items-center justify-center mb-3 shadow-lg`}><Icon className="w-5 h-5 text-white" /></div><p className="text-[#8b6f47] text-xs">{label}</p><p className="text-[#f5e6d3] text-xl font-bold mt-0.5">{value}</p></div>;
}
