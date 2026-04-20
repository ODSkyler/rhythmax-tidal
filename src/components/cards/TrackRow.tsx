import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { getCoverUrl } from '../../api/tidalApi';
import { formatDuration, getQualityBadge, formatArtists } from '../../lib/utils';
import type { Track } from '../../api/types';
import { PlayIcon, ExplicitIcon, AddToQueueIcon } from '../ui/Icons';

interface TrackRowProps {
  track: Track;
  index: number;
  queue: Track[];
  showAlbum?: boolean;
  showCover?: boolean;
}

export function TrackRow({ track, index, queue, showAlbum = false, showCover = true }: TrackRowProps) {
  const { playTrack, currentTrack, isPlaying, addToQueue } = usePlayerStore();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isActive = currentTrack?.id === track.id;
  const coverUrl = imgError ? '/placeholder.png' : getCoverUrl(track.album?.cover, 80);
  const badge = getQualityBadge(track.mediaMetadata?.tags);

  const handlePlay = () => {
    if (isActive) {
      usePlayerStore.getState().togglePlay();
    } else {
      playTrack(track, queue, index);
    }
  };

  const handleAddQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
  };

  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
        transition-all duration-150
        ${isActive ? 'bg-accent-dim' : 'hover:bg-bg-hover'}`}
      onClick={handlePlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Index / Play indicator */}
      <div className="w-8 flex items-center justify-center flex-shrink-0">
        {hovered || isActive ? (
          <button className="text-text-primary">
            {isActive && isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <div className="equalizer-bar" />
                <div className="equalizer-bar" style={{ animationDelay: '0.2s' }} />
                <div className="equalizer-bar" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : (
              <PlayIcon size={16} />
            )}
          </button>
        ) : (
          <span className={`text-sm font-mono ${isActive ? 'text-accent' : 'text-text-muted'}`}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Cover */}
      {showCover && (
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={coverUrl}
            alt={track.album?.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {track.explicit && <ExplicitIcon size={12} className="text-text-muted flex-shrink-0" />}
          <p className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-accent' : 'text-text-primary'}`}>
            {track.title}
          </p>
          {badge && (
            <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-accent-dim
              border border-accent/20 text-accent font-mono flex-shrink-0">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary line-clamp-1">
          {formatArtists(track.artists)}
          {showAlbum && track.album?.title && ` · ${track.album.title}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleAddQueue}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted
            hover:text-text-primary hover:bg-bg-elevated transition-all duration-150"
          title="Add to queue"
        >
          <AddToQueueIcon size={15} />
        </button>
        <span className="text-xs text-text-muted font-mono w-10 text-right">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
}
