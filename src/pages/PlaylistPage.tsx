import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistDetails, getCoverUrl } from '../api/tidalApi';
import type { PlaylistDetail } from '../api/types';
import { TrackRow } from '../components/cards/TrackRow';
import { TrackRowSkeleton } from '../components/ui/Skeleton';
import { usePlayerStore } from '../store/playerStore';
import { PlayIcon, ShuffleIcon } from '../components/ui/Icons';
import { formatDurationLong, shuffleArray } from '../lib/utils';
import { hexToRgba } from '../lib/utils';

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const { playTrack } = usePlayerStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPlaylistDetails(id)
      .then(setDetail)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }

  const playlist = detail?.playlist;
  const tracks = detail?.items?.map((i: any) => i.item) ?? [];
  const coverUrl = imgError
    ? '/placeholder.png'
    : getCoverUrl(playlist?.squareImage ?? playlist?.image ?? null, 640);

  const playAll = () => {
    if (tracks.length) playTrack(tracks[0], tracks, 0);
  };

  const playShuffled = () => {
    if (!tracks.length) return;
    const shuffled = shuffleArray(tracks);
    playTrack(shuffled[0], shuffled, 0);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div
        className="relative px-4 md:px-8 pt-8 pb-6"
        style={{
          background: 'linear-gradient(to bottom, rgba(2,212,160,0.15), #070709)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex-shrink-0">
            {loading ? (
              <div className="w-full h-full bg-bg-elevated animate-pulse" />
            ) : (
              <img
                src={coverUrl}
                alt={playlist?.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col gap-3">
                <div className="h-3 bg-bg-elevated rounded w-20 animate-pulse" />
                <div className="h-8 bg-bg-elevated rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-bg-elevated rounded w-full animate-pulse" />
              </div>
            ) : playlist && (
              <>
                <p className="text-xs text-text-muted uppercase tracking-widest font-mono mb-2">
                  {playlist.type ?? 'Playlist'}
                </p>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-2 line-clamp-3">
                  {playlist.title}
                </h1>
                {playlist.description && (
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">{playlist.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                  <span>{playlist.numberOfTracks} tracks</span>
                  <span>·</span>
                  <span>{formatDurationLong(playlist.duration)}</span>
                  {playlist.promotedArtists && playlist.promotedArtists.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="line-clamp-1">
                        {playlist.promotedArtists.slice(0, 3).map((a) => a.name).join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!loading && tracks.length > 0 && (
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={playAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent
                text-bg-primary font-semibold text-sm hover:bg-accent-bright transition-colors shadow-glow-sm"
            >
              <PlayIcon size={18} /> Play
            </button>
            <button
              onClick={playShuffled}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-bg-elevated
                text-text-primary font-semibold text-sm hover:bg-bg-hover border border-border transition-colors"
            >
              <ShuffleIcon size={18} /> Shuffle
            </button>
          </div>
        )}
      </div>

      {/* Tracks */}
      <div className="px-2 md:px-4 pb-8">
        {loading ? (
          <div>{[...Array(10)].map((_, i) => <TrackRowSkeleton key={i} />)}</div>
        ) : tracks.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-text-muted">No tracks in this playlist</p>
          </div>
        ) : (
          <div>
            {tracks.map((track, i) => (
              <TrackRow key={`${track.id}-${i}`} track={track} index={i} queue={tracks} showAlbum />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
