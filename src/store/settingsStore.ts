const SETTINGS_KEY = 'daffy_settings';

type Settings = {
  deliveryFee: number;
};

const DEFAULT_SETTINGS: Settings = {
  deliveryFee: 85,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribeSettings(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function getDeliveryFee(): number {
  return getSettings().deliveryFee;
}

export function setDeliveryFee(value: number): { ok: boolean; error?: string } {
  if (!Number.isFinite(value) || value < 0) {
    return { ok: false, error: 'Teslimat ücreti 0 veya daha büyük olmalı.' };
  }

  const rounded = Math.round(value);
  const next = { ...getSettings(), deliveryFee: rounded };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  emit();

  return { ok: true };
}
