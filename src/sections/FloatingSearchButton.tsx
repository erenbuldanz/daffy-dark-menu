import { Search } from 'lucide-react';

interface FloatingSearchButtonProps {
  hasCartBanner: boolean;
  onClick: () => void;
}

export function FloatingSearchButton({ hasCartBanner, onClick }: FloatingSearchButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Aramayı aç"
      className={`fixed right-5 z-50 w-14 h-14 rounded-2xl bg-[#3d2714] hover:bg-[#2a1a0a] text-white shadow-xl transition-all active:scale-95 ${
        hasCartBanner ? 'bottom-40' : 'bottom-24'
      }`}
    >
      <span className="sr-only">Arama</span>
      <Search className="w-6 h-6 mx-auto" />
    </button>
  );
}
