import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, SearchIcon, SettingsIcon } from '../ui/Icons';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/search', label: 'Search', Icon: SearchIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
];

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 h-full bg-bg-surface
        border-r border-border transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-56'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0`}>
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <span className="text-bg-primary font-display font-bold text-sm">R</span>
        </div>
        {!collapsed && (
          <span className="text-text-primary font-display font-bold text-lg tracking-tight">
            Rhythmax
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom branding */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-text-muted text-center">
            RHythmax for TIDAL
          </p>
        </div>
      )}
    </aside>
  );
}

// Mobile bottom navigation
export function BottomNav() {
  return (
    <nav className="md:hidden flex items-center justify-around
      bg-bg-surface/95 backdrop-blur-xl border-t border-border
      h-14 flex-shrink-0 z-40">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 transition-colors
            ${isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'}`
          }
        >
          <Icon size={22} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
