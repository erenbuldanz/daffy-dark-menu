export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-warm">
      <div className="max-w-lg mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Sol: Avatar ve Marka */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#b87333]/30 shadow-sm flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop"
                alt="Daffy Dark"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-serif text-xl font-semibold tracking-wide text-[#1e0f00]">
              Daffy <span className="text-copper-gradient">Dark</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
