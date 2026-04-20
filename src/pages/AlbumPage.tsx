import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumDetails, getCoverUrl } from '../api/tidalApi';
import { formatArtists, formatDurationLong, formatReleaseYear, shuffleArray, getQualityBadge, hexToRgba } from '../lib/utils';
import type { Album, Track } from '../api/types';
import { TrackRow } from '../components/cards/TrackRow';
import { TrackRowSkeleton } from '../components/ui/Skeleton';
import { usePlayerStore } from '../store/playerStore';
import { PlayIcon, ShuffleIcon, ExplicitIcon } from '../components/ui/Icons';

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const { playTrack } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getAlbumDetails(Number(id))
      .then(setAlbum)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (error) return <ErrorState message={error} />;

  const tracks: Track[] = album?.items?.map((i) => i.item) ?? [];
  const coverUrl = imgError ? '/placeholder.png' : getCoverUrl(album?.cover ?? null, 640);
  const vibrant = album?.vibrantColor ?? '#02D4A0';
  const badge = getQualityBadge(album?.mediaMetadata?.tags);

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
          background: loading
            ? 'linear-gradient(to bottom, #17171E, #070709)'
            : `linear-gradient(to bottom, ${hexToRgba(vibrant, 0.3)}, #070709)`,
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Cover art */}
          <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex-shrink-0">
            {loading ? (
              <div className="w-full h-full bg-bg-elevated animate-pulse" />
            ) : (
              <img
                src={coverUrl}
                alt={album?.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col gap-3">
                <div className="h-3 bg-bg-elevated rounded w-20 animate-pulse" />
                <div className="h-8 bg-bg-elevated rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-bg-elevated rounded w-1/2 animate-pulse" />
              </div>
            ) : album && (
              <>
                <p className="text-xs text-text-muted uppercase tracking-widest font-mono mb-2">
                  {album.type ?? 'Album'}
                </p>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-2 line-clamp-3">
                  {album.explicit && <ExplicitIcon size={20} className="inline mr-2 align-middle text-text-muted" />}
                  {album.title}
                </h1>
                <div
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-2"
                  onClick={() => album.artists?.[0] && navigate(`/artist/${album.artists[0].id}`)}
                >
                  {album.artist?.picture && (
                    <img
                      src={getCoverUrl(album.artist.picture, 80)}
                      alt={album.artist.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-text-primary">
                    {formatArtists(album.artists)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-text-muted">
                  <span>{formatReleaseYear(album.releaseDate)}</span>
                  <span>·</span>
                  <span>{album.numberOfTracks} tracks</span>
                  <span>·</span>
                  <span>{formatDurationLong(album.duration)}</span>
                  {badge && (
                    <>
                      <span>·</span>
                      <span className="px-2 py-0.5 rounded bg-accent-dim border border-accent/20 text-accent font-mono">
                        {badge}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {!loading && tracks.length > 0 && (
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={playAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent
                text-bg-primary font-semibold text-sm hover:bg-accent-bright
                transition-colors shadow-glow-sm"
            >
              <PlayIcon size={18} />
              Play
            </button>
            <button
              onClick={playShuffled}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-bg-elevated
                text-text-primary font-semibold text-sm hover:bg-bg-hover
                border border-border transition-colors"
            >
              <ShuffleIcon size={18} />
              Shuffle
            </button>
          </div>
        )}
      </div>

      {/* Track list */}
      <div className="px-2 md:px-4 pb-8">
        {loading ? (
          <div>
            {[...Array(10)].map((_, i) => <TrackRowSkeleton key={i} />)}
          </div>
        ) : (
          <div>
            {tracks.map((track, i) => (
              <TrackRow
                key={`${track.id}-${i}`}
                track={track}
                index={i}
                queue={tracks}
                showCover={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-text-muted">{message}</p>
    </div>
  );
}
