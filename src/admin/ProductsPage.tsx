import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Package, X, Save, ImageIcon, AlertTriangle } from 'lucide-react';
import type { MenuItem } from '@/types/menu';
import { generateId } from "@/store/menuStore";
import { fetchMenuData, saveMenuItemsApi } from "@/lib/api";

export function ProductsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchMenuData().then((d) => {
      setItems(d.menuItems);
      setCategories(d.categories);
    });
  }, []);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterCategory !== 'all') {
      result = result.filter(i => i.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, filterCategory, search]);

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const updated = items.filter(i => i.id !== deleteConfirm);
    setItems(updated);
    saveMenuItemsApi(updated);
    setDeleteConfirm(null);
  };

  const handleSave = (item: MenuItem) => {
    let updated: MenuItem[];
    if (isAdding) {
      updated = [...items, { ...item, id: generateId() }];
    } else {
      updated = items.map(i => i.id === item.id ? item : i);
    }
    setItems(updated);
    saveMenuItemsApi(updated);
    setEditingItem(null);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingItem({
      id: '',
      name: '',
      description: '',
      price: 0,
      category: categories[0]?.id || 'tatli',
      image: '',
    });
    setIsAdding(true);
  };

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || catId;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f5e6d3] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#f97316]" />
            Ürünler
          </h1>
          <p className="text-[#8b6f47] text-sm mt-1">{items.length} ürün</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6f47]" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#5d4037]/40 border border-[#8b6f47]/20 rounded-xl py-2.5 pl-10 pr-4 text-[#f5e6d3] placeholder-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 text-sm"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-[#5d4037]/40 border border-[#8b6f47]/20 rounded-xl py-2.5 px-4 text-[#f5e6d3] text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 [&>option]:bg-[#5d4037] [&>option]:text-[#f5e6d3]"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-[#5d4037]/40 backdrop-blur-sm border border-[#8b6f47]/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-[#5d4037]/60 transition-colors">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#4a3328]">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-[#8b6f47]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#f5e6d3] text-sm truncate">{item.name}</h3>
              <p className="text-[#8b6f47] text-xs truncate">{item.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#f97316] font-bold text-sm">{item.price} ₺</span>
                <span className="text-[#8b6f47] text-xs bg-[#4a3328] px-2 py-0.5 rounded-full">{getCategoryName(item.category)}</span>
                {item.options && item.options.length > 0 && (
                  <span className="text-[#8b6f47] text-xs bg-[#f97316]/10 px-2 py-0.5 rounded-full">{item.options.length} seçenek</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => { setEditingItem(item); setIsAdding(false); }}
                className="w-9 h-9 bg-[#f97316]/15 text-[#f97316] rounded-lg flex items-center justify-center hover:bg-[#f97316]/25 transition-colors"
                title="Düzenle"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="w-9 h-9 bg-red-500/15 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/25 transition-colors"
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-3 text-[#8b6f47] opacity-50" />
            <p className="text-[#8b6f47]">Ürün bulunamadı</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {editingItem && (
        <ProductForm
          item={editingItem}
          categories={categories}
          isNew={isAdding}
          onSave={handleSave}
          onCancel={() => { setEditingItem(null); setIsAdding(false); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-gradient-to-b from-[#5d4037] to-[#4a3328] border border-[#8b6f47]/20 rounded-2xl p-6 max-w-sm w-full text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-[#f5e6d3] font-bold mb-2">Ürünü Sil</h3>
            <p className="text-[#d4c4a8] text-sm mb-4">
              Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-[#4a3328] border border-[#8b6f47]/20 text-[#d4c4a8] py-2.5 rounded-xl text-sm font-medium hover:bg-[#5d4037] transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductFormProps {
  item: MenuItem;
  categories: { id: string; name: string }[];
  isNew: boolean;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

function ProductForm({ item, categories, isNew, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<MenuItem>({ ...item });
  const [optionsText, setOptionsText] = useState(() => {
    if (!item.options?.length) return '';
    return item.options.map(o =>
      `${o.name}|${o.choices.join(',')}|${o.maxSelect || 1}`
    ).join('\n');
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const options = optionsText.trim()
      ? optionsText.trim().split('\n').map(line => {
          const [name, choices, maxSelect] = line.split('|');
          return {
            name: name?.trim() || '',
            choices: choices?.split(',').map(c => c.trim()).filter(Boolean) || [],
            maxSelect: parseInt(maxSelect) || 1,
          };
        }).filter(o => o.name && o.choices.length > 0)
      : undefined;

    onSave({ ...form, options });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gradient-to-b from-[#5d4037] to-[#4a3328] border border-[#8b6f47]/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#5d4037] border-b border-[#8b6f47]/20 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-[#f5e6d3]">
            {isNew ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
          </h2>
          <button onClick={onCancel} className="text-[#8b6f47] hover:text-[#f5e6d3] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-[#d4c4a8] block mb-1.5">Ürün Adı *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/20 rounded-xl py-2.5 px-4 text-[#f5e6d3] text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 placeholder-[#8b6f47]"
              placeholder="Ör: Antep Fıstıklı Pasta"
            />
          </div>

          <div>
            <label className="text-sm text-[#d4c4a8] block mb-1.5">Açıklama *</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/20 rounded-xl py-2.5 px-4 text-[#f5e6d3] text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 resize-none placeholder-[#8b6f47]"
              placeholder="Ürün açıklaması"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#d4c4a8] block mb-1.5">Fiyat (₺) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/20 rounded-xl py-2.5 px-4 text-[#f5e6d3] text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50"
              />
            </div>
            <div>
              <label className="text-sm text-[#d4c4a8] block mb-1.5">Kategori *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/20 rounded-xl py-2.5 px-4 text-[#f5e6d3] text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 [&>option]:bg-[#4a3328] [&>option]:text-[#f5e6d3]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#d4c4a8] block mb-1.5">Görsel URL</label>
            <input
              type="url"
              value={form.image || ''}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/20 rounded-xl py-2.5 px-4 text-[#f5e6d3] text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 placeholder-[#8b6f47]"
            />
            {form.image && (
              <img src={form.image} alt="Önizleme" className="w-full h-32 object-cover rounded-xl mt-2 border border-[#8b6f47]/20" />
            )}
          </div>

          <div>
            <label className="text-sm text-[#d4c4a8] block mb-1.5">
              Seçenekler <span className="text-[#8b6f47]">(Her satır: İsim|Seçim1,Seçim2|MaxSeçim)</span>
            </label>
            <textarea
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              rows={3}
              placeholder={"Meyve Tercihi|Muz,Çilek|2\nÇikolata Tercihi|Bitter,Sütlü,Beyaz|2"}
              className="w-full bg-[#4a3328]/80 border border-[#8b6f47]/20 rounded-xl py-2.5 px-4 text-[#f5e6d3] text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 resize-none font-mono placeholder-[#8b6f47]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-[#4a3328] border border-[#8b6f47]/20 text-[#d4c4a8] py-2.5 rounded-xl text-sm font-medium hover:bg-[#5d4037] transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform"
            >
              <Save className="w-4 h-4" />
              {isNew ? 'Ekle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
