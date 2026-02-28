import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div id="search-anchor" className="px-5 py-3">
      <div className="relative max-w-lg mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#9a8672]" />
        </div>
        <input
          id="menu-search-input"
          type="text"
          placeholder="Menüde ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#f5ebe0] border-none rounded-2xl py-3.5 pl-12 pr-14 text-[#3d2714] placeholder-[#9a8672] focus:outline-none focus:ring-2 focus:ring-[#b87333]/40 transition-all duration-300 text-sm"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="w-5 h-5 text-[#9a8672] hover:text-[#3d2714] transition-colors" />
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="w-9 h-9 bg-[#b87333] rounded-xl flex items-center justify-center shadow-sm">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
