import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomeFeed, getCoverUrl } from '../api/tidalApi';
import { formatArtists } from '../lib/utils';
import type { HomeFeed, Track, Album, Playlist } from '../api/types';
import { Shelf } from '../components/layout/Shelf';
import { TrackCard } from '../components/cards/TrackCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { PlaylistCard } from '../components/cards/PlaylistCard';
import { CardSkeleton, HeroSkeleton } from '../components/ui/Skeleton';
import { usePlayerStore } from '../store/playerStore';
import { PlayIcon, ExplicitIcon } from '../components/ui/Icons';

export default function HomePage() {
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playTrack } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    getHomeFeed()
      .then(setFeed)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-muted">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); getHomeFeed().then(setFeed).finally(() => setLoading(false)); }}
          className="px-4 py-2 rounded-xl bg-accent text-bg-primary text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const heroTrack = feed?.new_releases?.[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Hero section */}
      {loading ? (
        <HeroSkeleton />
      ) : heroTrack ? (
        <HeroBanner track={heroTrack} onPlay={() => {
          if (feed?.new_releases) playTrack(heroTrack, feed.new_releases, 0);
        }} />
      ) : null}

      <div className="mt-8">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-8">
                <div className="h-5 bg-bg-elevated rounded-lg w-32 mb-4 animate-pulse" />
                <div className="flex gap-3 overflow-hidden">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="flex-shrink-0 w-40">
                      <CardSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : feed ? (
          <>
            {/* New Releases */}
            {feed.new_releases?.length > 0 && (
              <Shelf title="New Releases" itemMinWidth="150px">
                {feed.new_releases.map((track, i) => (
                  <TrackCard key={track.id} track={track} queue={feed.new_releases} index={i} />
                ))}
              </Shelf>
            )}

            {/* Top Albums */}
            {feed.top_albums?.length > 0 && (
              <Shelf title="Top Albums" itemMinWidth="150px">
                {feed.top_albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </Shelf>
            )}

            {/* Featured Playlists */}
            {feed.featured_playlists?.length > 0 && (
              <Shelf title="Featured Playlists" itemMinWidth="160px">
                {feed.featured_playlists.map((playlist) => (
                  <PlaylistCard key={playlist.uuid} playlist={playlist} />
                ))}
              </Shelf>
            )}

            {/* Dynamic sections */}
            {feed.sections?.map((section) => {
              if (!section.items?.length) return null;

              if (section.type === 'TRACK_LIST') {
                const tracks = section.items as Track[];
                return (
                  <Shelf key={section.title} title={section.title} itemMinWidth="150px">
                    {tracks.map((track, i) => (
                      <TrackCard key={`${track.id}-${i}`} track={track} queue={tracks} index={i} />
                    ))}
                  </Shelf>
                );
              }

              if (section.type === 'ALBUM_LIST') {
                const albums = section.items as Album[];
                return (
                  <Shelf key={section.title} title={section.title} itemMinWidth="150px">
                    {albums.map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </Shelf>
                );
              }

              if (section.type === 'PLAYLIST_LIST') {
                const playlists = section.items as Playlist[];
                return (
                  <Shelf key={section.title} title={section.title} itemMinWidth="160px">
                    {playlists.map((playlist) => (
                      <PlaylistCard key={playlist.uuid} playlist={playlist} />
                    ))}
                  </Shelf>
                );
              }

              return null;
            })}
          </>
        ) : null}
      </div>
    </div>
  );
}

function HeroBanner({ track, onPlay }: { track: Track; onPlay: () => void }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const coverUrl = imgError ? '/placeholder.png' : getCoverUrl(track.album?.cover, 640);
  const vibrant = track.album?.vibrantColor ?? '#02D4A0';

  return (
    <div
      className="relative h-60 md:h-80 rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/album/${track.album?.id}`)}
    >
      <img
        src={coverUrl}
        alt={track.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={() => setImgError(true)}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${vibrant}CC 0%, transparent 60%), linear-gradient(to top, #070709CC 0%, transparent 50%)`
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-widest mb-2 font-mono">New Release</p>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white line-clamp-2 mb-1">
              {track.explicit && <ExplicitIcon size={16} className="inline mr-2 align-middle text-white/60" />}
              {track.title}
            </h2>
            <p className="text-white/70 text-sm">{formatArtists(track.artists)}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onPlay(); }}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center
              shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            <PlayIcon size={24} className="text-bg-primary ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
