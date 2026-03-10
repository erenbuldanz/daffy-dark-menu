import { adminLoginApi, changeAdminPasswordApi } from '@/lib/api';
import { clearAuthSession, getValidAuthToken, writeAuthSession } from './authSession';

export function getAuthToken(): string | null {
  return getValidAuthToken();
}

export function isAuthenticated(): boolean {
  return !!getValidAuthToken();
}

export async function login(password: string): Promise<boolean> {
  try {
    const data = await adminLoginApi(password);
    writeAuthSession({ token: data.token, expiry: data.expiry });
    return true;
  } catch {
    return false;
  }
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const normalizedNew = newPassword.trim();

  if (normalizedNew.length < 6) {
    return { ok: false, error: 'Yeni şifre en az 6 karakter olmalı.' };
  }

  try {
    await changeAdminPasswordApi(currentPassword, normalizedNew);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message || 'Şifre güncellenemedi.' };
  }
}

export function logout() {
  clearAuthSession();
}
