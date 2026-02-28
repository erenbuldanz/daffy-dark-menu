import type { MenuItem, CategoryInfo } from '@/types/menu';
import { menuItems as defaultMenuItems, categories as defaultCategories } from '@/data/menu';

const MENU_ITEMS_KEY = 'daffy_menu_items';
const CATEGORIES_KEY = 'daffy_categories';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Menu Items
export function getMenuItems(): MenuItem[] {
  return loadFromStorage(MENU_ITEMS_KEY, defaultMenuItems);
}

export function saveMenuItems(items: MenuItem[]) {
  saveToStorage(MENU_ITEMS_KEY, items);
}

export function addMenuItem(item: MenuItem): MenuItem[] {
  const items = getMenuItems();
  items.push(item);
  saveMenuItems(items);
  return items;
}

export function updateMenuItem(id: string, updated: Partial<MenuItem>): MenuItem[] {
  const items = getMenuItems().map(item =>
    item.id === id ? { ...item, ...updated } : item
  );
  saveMenuItems(items);
  return items;
}

export function deleteMenuItem(id: string): MenuItem[] {
  const items = getMenuItems().filter(item => item.id !== id);
  saveMenuItems(items);
  return items;
}

// Categories
export function getCategories(): CategoryInfo[] {
  return loadFromStorage(CATEGORIES_KEY, defaultCategories);
}

export function saveCategories(cats: CategoryInfo[]) {
  saveToStorage(CATEGORIES_KEY, cats);
}

export function addCategory(cat: CategoryInfo): CategoryInfo[] {
  const cats = getCategories();
  cats.push(cat);
  saveCategories(cats);
  return cats;
}

export function updateCategory(id: string, updated: Partial<CategoryInfo>): CategoryInfo[] {
  const cats = getCategories().map(c =>
    c.id === id ? { ...c, ...updated } : c
  );
  saveCategories(cats);
  return cats;
}

export function deleteCategory(id: string): CategoryInfo[] {
  const cats = getCategories().filter(c => c.id !== id);
  saveCategories(cats);
  return cats;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function resetToDefaults() {
  saveMenuItems(defaultMenuItems);
  saveCategories(defaultCategories);
}
