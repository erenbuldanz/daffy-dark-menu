import { useSyncExternalStore } from 'react';
import { Instagram } from 'lucide-react';
import { getSettings, subscribeSettings } from '@/store/settingsStore';

const DEFAULT_LOGO = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop';

export function Header() {
  const settings = useSyncExternalStore(subscribeSettings, getSettings);

  return (
    <header className="sticky top-0 z-50 glass-warm border-b border-[#e8d5c0]/70">
      <div className="max-w-lg mx-auto px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#c2874a]/35 shadow-[0_6px_16px_rgba(30,15,0,0.12)] flex-shrink-0">
              <img
                src={settings.logoUrl || DEFAULT_LOGO}
                alt={settings.restaurantName}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_LOGO; }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-xl font-semibold tracking-wide text-[#1e0f00] truncate">
                {settings.restaurantName}
              </h1>
              <p className="text-[11px] text-[#6b4b2a] truncate">{settings.restaurantAddress}</p>
              <p className="text-[11px] text-[#8a6a49] truncate">Çalışma Saatleri: {settings.workingHours}</p>
            </div>
          </div>

          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f4e3cf] to-[#ecd4b8] hover:from-[#eedac2] hover:to-[#e3c29f] text-[#8f5a2a] flex items-center justify-center transition-colors border border-[#e3c8a8]"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
