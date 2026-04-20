import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoverUrl } from '../../api/tidalApi';
import { formatDurationLong } from '../../lib/utils';
import type { Playlist } from '../../api/types';
import { PlayIcon } from '../ui/Icons';

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const coverUrl = imgError
    ? '/placeholder.png'
    : getCoverUrl(playlist.squareImage || playlist.image, 320);

  const handleClick = () => navigate(`/playlist/${playlist.uuid}`);

  return (
    <div
      className="group flex flex-col gap-2 cursor-pointer p-2 rounded-xl card-hover"
      onClick={handleClick}
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-card">
        <img
          src={coverUrl}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
          transition-opacity duration-200 flex items-end justify-end p-3">
          <button
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center
              shadow-glow-accent transform translate-y-2 group-hover:translate-y-0
              transition-transform duration-200"
          >
            <PlayIcon size={18} className="text-bg-primary ml-0.5" />
          </button>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium line-clamp-1 text-text-primary group-hover:text-accent transition-colors">
          {playlist.title}
        </p>
        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
          {playlist.numberOfTracks} tracks · {formatDurationLong(playlist.duration)}
        </p>
      </div>
    </div>
  );
}
