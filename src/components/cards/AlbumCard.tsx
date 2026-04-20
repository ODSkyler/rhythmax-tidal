import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoverUrl } from '../../api/tidalApi';
import { formatArtists, formatReleaseYear } from '../../lib/utils';
import type { Album } from '../../api/types';
import { PlayIcon } from '../ui/Icons';
import { usePlayerStore } from '../../store/playerStore';

interface AlbumCardProps {
  album: Album;
  size?: 'sm' | 'md' | 'lg';
}

export function AlbumCard({ album, size = 'md' }: AlbumCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const { playTrack } = usePlayerStore();

  const px = size === 'sm' ? 160 : size === 'lg' ? 640 : 320;
  const coverUrl = imgError ? '/placeholder.png' : getCoverUrl(album.cover, px as 160 | 320 | 640);

  const handleClick = () => navigate(`/album/${album.id}`);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Play first track if available
    if (album.items && album.items.length > 0) {
      const tracks = album.items.map((i) => i.item);
      playTrack(tracks[0], tracks, 0);
    } else {
      navigate(`/album/${album.id}`);
    }
  };

  return (
    <div
      className="group flex flex-col gap-2 cursor-pointer p-2 rounded-xl card-hover"
      onClick={handleClick}
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-card">
        <img
          src={coverUrl}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        {/* Vibrant color overlay on hover */}
        {album.vibrantColor && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ background: album.vibrantColor }}
          />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
          transition-opacity duration-200 flex items-end justify-end p-3">
          <button
            onClick={handlePlay}
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
          {album.title}
        </p>
        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
          {formatReleaseYear(album.releaseDate)}
          {album.artists?.length > 0 && ` · ${formatArtists(album.artists)}`}
        </p>
      </div>
    </div>
  );
}
