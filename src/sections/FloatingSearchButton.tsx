import { Phone } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { getSettings, subscribeSettings } from '@/store/settingsStore';

interface FloatingCallButtonProps {
  hasCartBanner: boolean;
}

export function FloatingCallButton({ hasCartBanner }: FloatingCallButtonProps) {
  const settings = useSyncExternalStore(subscribeSettings, getSettings);

  return (
    <a
      href={`tel:${settings.phoneNumber}`}
      aria-label="Telefonla ara"
      className={`fixed right-5 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c2874a] to-[#9f632b] hover:from-[#b9783d] hover:to-[#8e5724] text-white shadow-[0_14px_28px_rgba(159,99,43,0.38)] border border-[#f0d9bc]/40 transition-all active:scale-95 flex items-center justify-center ${
        hasCartBanner ? 'bottom-40' : 'bottom-24'
      }`}
    >
      <span className="sr-only">Ara</span>
      <Phone className="w-6 h-6" />
    </a>
  );
}
