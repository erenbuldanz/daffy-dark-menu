const AUTH_KEY = 'daffy_admin_auth';
const ADMIN_PASSWORD = 'daffy2025';

export function isAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;
    const { expiry } = JSON.parse(session);
    if (Date.now() > expiry) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    const session = {
      authenticated: true,
      expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
