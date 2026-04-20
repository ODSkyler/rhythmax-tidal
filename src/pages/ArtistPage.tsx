import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtistDetails, getCoverUrl } from '../api/tidalApi';
import type { ArtistDetail } from '../api/types';
import { TrackRow } from '../components/cards/TrackRow';
import { AlbumCard } from '../components/cards/AlbumCard';
import { TrackRowSkeleton, CardSkeleton } from '../components/ui/Skeleton';
import { usePlayerStore } from '../store/playerStore';
import { PlayIcon, ShuffleIcon } from '../components/ui/Icons';
import { shuffleArray } from '../lib/utils';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playTrack } = usePlayerStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getArtistDetails(Number(id))
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

  const tracks = detail?.tracks ?? [];
  const albums = detail?.albums?.items ?? [];
  const artistInfo = tracks[0]?.artists?.[0] ?? albums[0]?.artists?.[0];
  const artistPicture = artistInfo?.picture;
  const artistName = artistInfo?.name ?? 'Artist';

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
      {/* Artist hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-bg-elevated animate-pulse" />
        ) : (
          <>
            {artistPicture ? (
              <img
                src={getCoverUrl(artistPicture, 1280)}
                alt={artistName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                <span className="text-8xl font-display font-bold text-text-muted">
                  {artistName[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
          </>
        )}
        <div className="absolute bottom-6 left-6">
          {loading ? (
            <div className="h-10 w-48 bg-bg-elevated rounded-xl animate-pulse" />
          ) : (
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              {artistName}
            </h1>
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 pb-8">
        {/* Actions */}
        {!loading && tracks.length > 0 && (
          <div className="flex items-center gap-3 mt-4 mb-8">
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

        {/* Top Tracks */}
        <section className="mb-10">
          <h2 className="text-base font-display font-semibold text-text-primary mb-3">Popular Tracks</h2>
          {loading ? (
            <div>{[...Array(5)].map((_, i) => <TrackRowSkeleton key={i} />)}</div>
          ) : tracks.length === 0 ? (
            <p className="text-text-muted text-sm">No tracks available</p>
          ) : (
            <div>
              {tracks.slice(0, 10).map((track, i) => (
                <TrackRow key={`${track.id}-${i}`} track={track} index={i} queue={tracks} showAlbum />
              ))}
            </div>
          )}
        </section>

        {/* Albums */}
        {(loading || albums.length > 0) && (
          <section>
            <h2 className="text-base font-display font-semibold text-text-primary mb-4">Discography</h2>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
