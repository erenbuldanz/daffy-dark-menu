import type { CategoryInfo, MenuItem } from '@/types/menu';
import { categories as defaultCategories, menuItems as defaultMenuItems } from '@/data/menu';
import { clearAuthSession, getValidAuthToken } from '@/store/authSession';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface MenuPayload {
  categories: CategoryInfo[];
  menuItems: MenuItem[];
}

interface AdminLoginResponse {
  token: string;
  expiry: number;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const authToken = getValidAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    let message = `API ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data?.error === 'string' && data.error.trim()) {
        message = data.error;
      }
    } catch {
      // no-op
    }

    if (res.status === 401) {
      clearAuthSession();
    }

    throw new ApiError(message, res.status);
  }

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

export async function adminLoginApi(password: string): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function changeAdminPasswordApi(currentPassword: string, newPassword: string) {
  return request<{ ok: boolean }>('/admin/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function saveCategoriesApi(categories: CategoryInfo[]) {
  return request<CategoryInfo[]>('/categories', { method: 'PUT', body: JSON.stringify(categories) });
}

export async function saveMenuItemsApi(menuItems: MenuItem[]) {
  return request<MenuItem[]>('/menu-items', { method: 'PUT', body: JSON.stringify(menuItems) });
}
