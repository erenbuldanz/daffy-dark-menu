const AUTH_KEY = 'daffy_admin_auth';

export interface AuthSession {
  token: string;
  expiry: number;
}

export function readAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY);
}

export function getValidAuthToken(): string | null {
  const session = readAuthSession();
  if (!session) return null;

  if (Date.now() > session.expiry) {
    clearAuthSession();
    return null;
  }

  return session.token;
}
