import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, BottomNav } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MiniPlayer } from './components/player/MiniPlayer';
import { FullPlayer } from './components/player/FullPlayer';
import { QueuePanel } from './components/player/QueuePanel';
import { usePlayerStore } from './store/playerStore';
import { useInstanceInit } from './hooks/useInstanceInit';
import { SpinnerIcon } from './components/ui/Icons';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AlbumPage = lazy(() => import('./pages/AlbumPage'));
const ArtistPage = lazy(() => import('./pages/ArtistPage'));
const PlaylistPage = lazy(() => import('./pages/PlaylistPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <SpinnerIcon size={32} className="text-accent" />
    </div>
  );
}

function InstanceGate({ children }: { children: React.ReactNode }) {
  const { status, error, retry } = useInstanceInit();

  if (status === 'loading') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-glow-accent">
          <span className="text-bg-primary font-display font-bold text-xl">R</span>
        </div>
        <SpinnerIcon size={28} className="text-accent" />
        <p className="text-text-muted text-sm">Connecting to TIDAL network…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
          <span className="text-bg-primary font-display font-bold text-xl">R</span>
        </div>
        <p className="text-text-primary font-semibold">Connection Failed</p>
        <p className="text-text-muted text-sm max-w-xs">{error}</p>
        <button
          onClick={retry}
          className="px-5 py-2.5 rounded-full bg-accent text-bg-primary font-semibold text-sm
            hover:bg-accent-bright transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showFullPlayer, showQueue } = usePlayerStore();

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-bg-primary overflow-hidden font-body">
        {/* Full screen player overlay */}
        <FullPlayer />

        {/* Main layout */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((v) => !v)}
          />

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 min-h-0">
            <TopBar
              onMenuToggle={() => setSidebarCollapsed((v) => !v)}
              sidebarCollapsed={sidebarCollapsed}
            />

            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Page content */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <InstanceGate>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/album/:id" element={<AlbumPage />} />
                      <Route path="/artist/:id" element={<ArtistPage />} />
                      <Route path="/playlist/:id" element={<PlaylistPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </InstanceGate>
              </div>

              {/* Queue panel (desktop) */}
              {showQueue && <QueuePanel />}
            </div>
          </div>
        </div>

        {/* Mini Player */}
        <MiniPlayer />

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
