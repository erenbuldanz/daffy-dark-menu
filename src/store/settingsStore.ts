const SETTINGS_KEY = 'daffy_settings';

export type Settings = {
  deliveryFee: number;
  minOrderAmount: number;
  isOpen: boolean;
  whatsAppNumber: string;
  phoneNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  workingHours: string;
  instagramUrl: string;
  orderMessageTemplate: string;
};

const DEFAULT_SETTINGS: Settings = {
  deliveryFee: 85,
  minOrderAmount: 0,
  isOpen: true,
  whatsAppNumber: '905548273106',
  phoneNumber: '05548273106',
  restaurantName: 'Daffy Dark',
  restaurantAddress: 'Adres bilgisi eklenmedi',
  workingHours: 'Her gün 10:00 - 23:00',
  instagramUrl: '',
  orderMessageTemplate:
    'Merhaba {{restaurantName}}!\n\nSipariş Vermek İstiyorum:\n\n{{items}}\nAra Toplam: {{subtotal}} ₺\nTeslimat Ücreti: {{deliveryFee}} ₺\nGenel Toplam: {{grandTotal}} ₺',
};

const listeners = new Set<() => void>();

let storageListenerBound = false;

function ensureStorageListener() {
  if (storageListenerBound || typeof window === 'undefined') return;
  window.addEventListener('storage', (event) => {
    if (event.key === SETTINGS_KEY) emit();
  });
  storageListenerBound = true;
}

function emit() {
  listeners.forEach((fn) => fn());
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

export function subscribeSettings(fn: () => void) {
  ensureStorageListener();
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

export function updateSettings(nextPartial: Partial<Settings>): { ok: boolean; error?: string } {
  const current = getSettings();
  const next: Settings = {
    ...current,
    ...nextPartial,
  };

  if (!Number.isFinite(next.deliveryFee) || next.deliveryFee < 0) {
    return { ok: false, error: 'Teslimat ücreti 0 veya daha büyük olmalı.' };
  }

  if (!Number.isFinite(next.minOrderAmount) || next.minOrderAmount < 0) {
    return { ok: false, error: 'Minimum sipariş tutarı 0 veya daha büyük olmalı.' };
  }

  next.deliveryFee = Math.round(next.deliveryFee);
  next.minOrderAmount = Math.round(next.minOrderAmount);
  next.whatsAppNumber = normalizePhone(next.whatsAppNumber);
  next.phoneNumber = normalizePhone(next.phoneNumber);
  next.restaurantName = next.restaurantName.trim() || DEFAULT_SETTINGS.restaurantName;
  next.restaurantAddress = next.restaurantAddress.trim() || DEFAULT_SETTINGS.restaurantAddress;
  next.workingHours = next.workingHours.trim() || DEFAULT_SETTINGS.workingHours;
  next.instagramUrl = next.instagramUrl.trim();
  next.orderMessageTemplate = next.orderMessageTemplate.trim() || DEFAULT_SETTINGS.orderMessageTemplate;

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  emit();
  return { ok: true };
}

export function getDeliveryFee(): number {
  return getSettings().deliveryFee;
}
