import { useSyncExternalStore } from 'react';
import { getSettings, subscribeSettings } from '@/store/settingsStore';

export function Header() {
  const settings = useSyncExternalStore(subscribeSettings, getSettings);

  return (
    <header className="sticky top-0 z-50 glass-warm">
      <div className="max-w-lg mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#b87333]/30 shadow-sm flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop"
                alt={settings.restaurantName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold tracking-wide text-[#1e0f00]">
                {settings.restaurantName}
              </h1>
              <p className="text-[11px] text-[#6b4b2a] truncate max-w-[220px]">{settings.restaurantAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
