import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtistImageUrl } from '../../api/tidalApi';
import type { Artist } from '../../api/types';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const imageUrl = imgError ? '/placeholder.png' : getArtistImageUrl(artist.picture, 320);
  const hasPicture = !!artist.picture;

  return (
    <div
      className="group flex flex-col items-center gap-3 cursor-pointer p-2"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-card
        ring-2 ring-transparent group-hover:ring-accent transition-all duration-200">
        {hasPicture ? (
          <img
            src={imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-text-muted">
              {artist.name[0].toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-1">
          {artist.name}
        </p>
        <p className="text-xs text-text-muted mt-0.5">Artist</p>
      </div>
    </div>
  );
}
