import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Grid3X3, X, Save, AlertTriangle } from 'lucide-react';
import type { CategoryInfo } from '@/types/menu';
import { generateId } from "@/store/menuStore";
import { fetchMenuData, saveCategoriesApi } from "@/lib/api";

const ICON_OPTIONS = ['Cake', 'GlassWater', 'Coffee', 'Snowflake', 'Pizza', 'Soup', 'Salad', 'IceCream'];

export function CategoriesPage() {
  const [cats, setCats] = useState<CategoryInfo[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    fetchMenuData().then((d) => {
      setCats(d.categories);
      setMenuItems(d.menuItems);
    });
  }, []);
  const [editingCat, setEditingCat] = useState<CategoryInfo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getItemCount = (catId: string) =>
    menuItems.filter(i => i.category === catId).length;

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const doDelete = () => {
    if (!deleteConfirm) return;
    const updated = cats.filter(c => c.id !== deleteConfirm);
    setCats(updated);
    saveCategoriesApi(updated);
    setDeleteConfirm(null);
  };

  const handleSave = (cat: CategoryInfo) => {
    let updated: CategoryInfo[];
    if (isAdding) {
      const newId = generateId();
      updated = [...cats, { ...cat, id: newId }];
    } else {
      updated = cats.map(c => c.id === cat.id ? cat : c);
    }
    setCats(updated);
    saveCategoriesApi(updated);
    setEditingCat(null);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingCat({
      id: '',
      name: '',
      icon: 'Cake',
    });
    setIsAdding(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-amber-600" />
            Kategoriler
          </h1>
          <p className="text-slate-500 text-sm mt-1">{cats.length} kategori</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {cats.map(cat => {
          const count = getItemCount(cat.id);
          return (
            <div key={cat.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="w-12 h-12 bg-[#f97316]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 text-lg font-bold">{cat.icon.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm">{cat.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  {count} ürün • İkon: {cat.icon}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditingCat(cat); setIsAdding(false); }}
                  className="w-9 h-9 bg-[#f97316]/15 text-amber-600 rounded-lg flex items-center justify-center hover:bg-[#f97316]/25 transition-colors"
                  title="Düzenle"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="w-9 h-9 bg-red-500/15 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/25 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Modal */}
      {editingCat && (
        <CategoryForm
          cat={editingCat}
          isNew={isAdding}
          onSave={handleSave}
          onCancel={() => { setEditingCat(null); setIsAdding(false); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold mb-2">Dikkat!</h3>
            <p className="text-slate-600 text-sm mb-4">
              {getItemCount(deleteConfirm) > 0
                ? `Bu kategoride ${getItemCount(deleteConfirm)} ürün var. Yine de silmek istiyor musunuz?`
                : 'Bu kategoriyi silmek istediğinize emin misiniz?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={doDelete}
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

interface CategoryFormProps {
  cat: CategoryInfo;
  isNew: boolean;
  onSave: (cat: CategoryInfo) => void;
  onCancel: () => void;
}

function CategoryForm({ cat, isNew, onSave, onCancel }: CategoryFormProps) {
  const [form, setForm] = useState<CategoryInfo>({ ...cat });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-sm">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {isNew ? 'Yeni Kategori' : 'Kategoriyi Düzenle'}
          </h2>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600 block mb-1.5">Kategori Adı *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 placeholder-[#8b6f47]"
              placeholder="Ör: Tatlılar"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 block mb-1.5">İkon</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.icon === icon
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform"
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
