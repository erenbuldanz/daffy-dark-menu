import type { CartItem, MenuItem } from '@/types/menu';
import { getDeliveryFee } from '@/store/settingsStore';

const CART_KEY = 'daffy_cart';

let listeners: (() => void)[] = [];
let cachedCart: CartItem[] | null = null;
let cachedCount: number | null = null;
let cachedTotal: number | null = null;

function invalidateCache() {
  cachedCart = null;
  cachedCount = null;
  cachedTotal = null;
}

function notify() {
  invalidateCache();
  listeners.forEach(fn => fn());
}

export function subscribeCart(fn: () => void) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}

export function getCart(): CartItem[] {
  if (cachedCart !== null) return cachedCart;
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      cachedCart = JSON.parse(stored);
      return cachedCart!;
    }
  } catch { /* ignore */ }
  cachedCart = [];
  return cachedCart;
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notify();
}

export function addToCart(
  product: MenuItem,
  quantity: number,
  selectedOptions: Record<string, string[]>
) {
  const cart = [...getCart()];
  const optKey = JSON.stringify(selectedOptions);
  const existingIdx = cart.findIndex(
    i => i.product.id === product.id && JSON.stringify(i.selectedOptions) === optKey
  );
  if (existingIdx >= 0) {
    cart[existingIdx] = { ...cart[existingIdx], quantity: cart[existingIdx].quantity + quantity };
  } else {
    cart.push({ product, quantity, selectedOptions });
  }
  saveCart(cart);
}

export function updateCartItemQuantity(index: number, quantity: number) {
  const cart = [...getCart()];
  if (cart[index]) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index] = { ...cart[index], quantity };
    }
    saveCart(cart);
  }
}

export function removeFromCart(index: number) {
  const cart = [...getCart()];
  cart.splice(index, 1);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  notify();
}

export function getCartTotal(): number {
  if (cachedTotal !== null) return cachedTotal;
  cachedTotal = getCart().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return cachedTotal;
}

export function getCartCount(): number {
  if (cachedCount !== null) return cachedCount;
  cachedCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
  return cachedCount;
}

export function generateWhatsAppMessage(): string {
  const cart = getCart();
  if (cart.length === 0) return '';

  let msg = 'Merhaba Daffy Dark!\n\nSipariş Vermek İstiyorum:\n\n';

  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.product.name}\n`;
    msg += `   Adet: ${item.quantity}\n`;
    msg += `   Fiyat: ${(item.product.price * item.quantity).toLocaleString('tr-TR')} ₺\n`;

    const opts = Object.entries(item.selectedOptions).filter(([, v]) => v.length > 0);
    if (opts.length > 0) {
      opts.forEach(([name, choices]) => {
        msg += `   ${name}: ${choices.join(', ')}\n`;
      });
    }
    msg += '\n';
  });

  const total = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const grandTotal = total + deliveryFee;
  msg += `Ara Toplam: ${total.toLocaleString('tr-TR')} ₺\n`;
  msg += `Teslimat Ücreti: ${deliveryFee.toLocaleString('tr-TR')} ₺\n`;
  msg += `Genel Toplam: ${grandTotal.toLocaleString('tr-TR')} ₺`;

  return msg;
}
