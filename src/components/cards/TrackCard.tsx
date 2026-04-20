import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { getCoverUrl } from '../../api/tidalApi';
import { formatArtists } from '../../lib/utils';
import { formatDuration } from '../../lib/utils';
import type { Track } from '../../api/types';
import { PlayIcon, ExplicitIcon } from '../ui/Icons';

interface TrackCardProps {
  track: Track;
  queue?: Track[];
  index?: number;
  showIndex?: boolean;
  compact?: boolean;
}

export function TrackCard({ track, queue, index = 0, showIndex = false, compact = false }: TrackCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const [imgError, setImgError] = useState(false);

  const isActive = currentTrack?.id === track.id;
  const coverUrl = imgError ? '/placeholder.png' : getCoverUrl(track.album?.cover, 160);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      usePlayerStore.getState().togglePlay();
    } else {
      playTrack(track, queue ?? [track], queue ? index : 0);
    }
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all duration-150
          ${isActive ? 'bg-accent-dim' : 'hover:bg-bg-hover'}`}
        onClick={handlePlay}
      >
        <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
          <img
            src={coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center
            transition-opacity duration-150
            ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isActive && isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <div className="equalizer-bar" style={{ animationDelay: '0s' }} />
                <div className="equalizer-bar" style={{ animationDelay: '0.2s' }} />
                <div className="equalizer-bar" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : (
              <PlayIcon size={16} className="text-white" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-accent' : 'text-text-primary'}`}>
            {track.title}
          </p>
          <p className="text-xs text-text-secondary line-clamp-1">
            {formatArtists(track.artists)}
          </p>
        </div>
        <span className="text-xs text-text-muted flex-shrink-0">
          {formatDuration(track.duration)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group flex flex-col gap-2 cursor-pointer p-2 rounded-xl transition-all duration-200 card-hover
        ${isActive ? 'bg-accent-dim' : ''}`}
      onClick={handlePlay}
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-card">
        <img
          src={coverUrl}
          alt={track.album?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center
          transition-all duration-200
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isActive && isPlaying ? (
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-glow-accent">
              <div className="flex items-end gap-0.5 h-4">
                <div className="equalizer-bar" />
                <div className="equalizer-bar" style={{ animationDelay: '0.2s' }} />
                <div className="equalizer-bar" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          ) : (
            <button
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-glow-accent
                transform scale-90 group-hover:scale-100 transition-transform duration-200"
            >
              <PlayIcon size={18} className="text-bg-primary ml-0.5" />
            </button>
          )}
        </div>
        {showIndex && (
          <div className="absolute top-2 left-2 bg-bg-primary/80 backdrop-blur-sm text-xs font-mono
            text-text-secondary px-1.5 py-0.5 rounded-md">
            {String(index + 1).padStart(2, '0')}
          </div>
        )}
      </div>
      <div>
        <p className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-accent' : 'text-text-primary'}`}>
          {track.explicit && (
            <ExplicitIcon size={12} className="inline mr-1 text-text-muted align-middle" />
          )}
          {track.title}
        </p>
        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
          {formatArtists(track.artists)}
        </p>
      </div>
    </div>
  );
}
