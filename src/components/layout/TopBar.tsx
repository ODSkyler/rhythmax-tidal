import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, MenuIcon } from '../ui/Icons';

interface TopBarProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(e as unknown as React.FormEvent);
  };

  return (
    <header className="h-16 flex items-center gap-4 px-4 md:px-6 border-b border-border
      bg-bg-surface/80 backdrop-blur-xl flex-shrink-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="md:hidden w-9 h-9 rounded-lg hover:bg-bg-hover flex items-center justify-center
          text-text-secondary transition-colors"
      >
        <MenuIcon size={22} />
      </button>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tracks, albums, artists..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-bg-elevated border border-border
              text-sm text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              transition-all duration-150"
          />
        </div>
      </form>

      {/* Right side */}
      <div className="hidden md:flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30
          flex items-center justify-center">
          <span className="text-xs font-display font-semibold text-accent">R</span>
        </div>
      </div>
    </header>
  );
}
