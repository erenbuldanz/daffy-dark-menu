import type { CategoryInfo, MenuItem } from '@/types/menu';
import { categories as defaultCategories, menuItems as defaultMenuItems } from '@/data/menu';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface MenuPayload {
  categories: CategoryInfo[];
  menuItems: MenuItem[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchMenuData(): Promise<MenuPayload> {
  try {
    const data = await request<MenuPayload>('/menu');
    if (data.categories.length === 0 && data.menuItems.length === 0) {
      try {
        await request<MenuPayload>('/bootstrap', {
          method: 'POST',
          body: JSON.stringify({ categories: defaultCategories, menuItems: defaultMenuItems }),
        });
        return { categories: defaultCategories, menuItems: defaultMenuItems };
      } catch {
        return data;
      }
    }
    return data;
  } catch {
    return { categories: defaultCategories, menuItems: defaultMenuItems };
  }
}

export async function saveCategoriesApi(categories: CategoryInfo[]) {
  return request<CategoryInfo[]>('/categories', { method: 'PUT', body: JSON.stringify(categories) });
}

export async function saveMenuItemsApi(menuItems: MenuItem[]) {
  return request<MenuItem[]>('/menu-items', { method: 'PUT', body: JSON.stringify(menuItems) });
}
