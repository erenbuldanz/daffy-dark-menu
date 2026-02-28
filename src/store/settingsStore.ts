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
let cachedSettings: Settings | null = null;

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

function emit() {
  listeners.forEach((fn) => fn());
}

function normalizeSettings(input: Partial<Settings>): Settings {
  const next: Settings = {
    ...DEFAULT_SETTINGS,
    ...input,
  };

  next.deliveryFee = Number.isFinite(next.deliveryFee) ? Math.max(0, Math.round(next.deliveryFee)) : DEFAULT_SETTINGS.deliveryFee;
  next.minOrderAmount = Number.isFinite(next.minOrderAmount) ? Math.max(0, Math.round(next.minOrderAmount)) : DEFAULT_SETTINGS.minOrderAmount;
  next.isOpen = Boolean(next.isOpen);
  next.whatsAppNumber = normalizePhone(next.whatsAppNumber || DEFAULT_SETTINGS.whatsAppNumber);
  next.phoneNumber = normalizePhone(next.phoneNumber || DEFAULT_SETTINGS.phoneNumber);
  next.restaurantName = (next.restaurantName || '').trim() || DEFAULT_SETTINGS.restaurantName;
  next.restaurantAddress = (next.restaurantAddress || '').trim() || DEFAULT_SETTINGS.restaurantAddress;
  next.workingHours = (next.workingHours || '').trim() || DEFAULT_SETTINGS.workingHours;
  next.instagramUrl = (next.instagramUrl || '').trim();
  next.orderMessageTemplate = (next.orderMessageTemplate || '').trim() || DEFAULT_SETTINGS.orderMessageTemplate;

  return next;
}

function readRawSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return normalizeSettings(JSON.parse(raw) as Partial<Settings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function ensureStorageListener() {
  if (storageListenerBound || typeof window === 'undefined') return;

  window.addEventListener('storage', (event) => {
    if (event.key === SETTINGS_KEY) {
      cachedSettings = readRawSettings();
      emit();
    }
  });

  storageListenerBound = true;
}

export function subscribeSettings(fn: () => void) {
  ensureStorageListener();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSettings(): Settings {
  if (cachedSettings) return cachedSettings;
  cachedSettings = readRawSettings();
  return cachedSettings;
}

export function updateSettings(nextPartial: Partial<Settings>): { ok: boolean; error?: string } {
  const merged = normalizeSettings({
    ...getSettings(),
    ...nextPartial,
  });

  if (!Number.isFinite(Number(nextPartial.deliveryFee ?? merged.deliveryFee)) || merged.deliveryFee < 0) {
    return { ok: false, error: 'Teslimat ücreti 0 veya daha büyük olmalı.' };
  }

  if (!Number.isFinite(Number(nextPartial.minOrderAmount ?? merged.minOrderAmount)) || merged.minOrderAmount < 0) {
    return { ok: false, error: 'Minimum sipariş tutarı 0 veya daha büyük olmalı.' };
  }

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  cachedSettings = merged;
  emit();
  return { ok: true };
}

export function getDeliveryFee(): number {
  return getSettings().deliveryFee;
}
