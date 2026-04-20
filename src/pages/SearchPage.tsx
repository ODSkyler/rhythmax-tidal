import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchTracks, searchAlbums, searchArtists, searchPlaylists } from '../api/tidalApi';
import type { Track, Album, Artist, Playlist } from '../api/types';
import { TrackCard } from '../components/cards/TrackCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { ArtistCard } from '../components/cards/ArtistCard';
import { PlaylistCard } from '../components/cards/PlaylistCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { SearchIcon, SpinnerIcon } from '../components/ui/Icons';
import { debounce } from '../lib/utils';

type Tab = 'tracks' | 'albums' | 'artists' | 'playlists';

interface SearchResults {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = useState<Tab>('tracks');
  const [results, setResults] = useState<SearchResults>({ tracks: [], albums: [], artists: [], playlists: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'tracks', label: 'Tracks' },
    { key: 'albums', label: 'Albums' },
    { key: 'artists', label: 'Artists' },
    { key: 'playlists', label: 'Playlists' },
  ];

  const doSearch = useCallback(
  debounce(async (q: string) => {
    if (!q.trim()) {
      setResults({ tracks: [], albums: [], artists: [], playlists: [] });
      setSearched(false);
      return;
    }

    setLoading(true);

    try {
      let newResults = {
        tracks: [] as Track[],
        albums: [] as Album[],
        artists: [] as Artist[],
        playlists: [] as Playlist[],
      };

      if (activeTab === 'tracks') {
        newResults.tracks = await searchTracks(q);
      } else if (activeTab === 'albums') {
        newResults.albums = await searchAlbums(q);
      } else if (activeTab === 'artists') {
        newResults.artists = await searchArtists(q);
      } else if (activeTab === 'playlists') {
        newResults.playlists = await searchPlaylists(q);
      }

      setResults(newResults);
      setSearched(true);
    } catch (e) {
      console.error('Search error', e);
    } finally {
      setLoading(false);
    }
  }, 400) as (q: string) => void,
  [activeTab] // 👈 IMPORTANT
);

  useEffect(() => {
  const q = searchParams.get('q') ?? '';
  if (q) {
    setQuery(q);
    doSearch(q);
  }
}, [searchParams, activeTab]); // 👈 IMPORTANT

useEffect(() => {
  if (query) {
    doSearch(query);
  }
}, [activeTab]);

  const handleInput = (val: string) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {}, { replace: true });
    doSearch(val);
  };

  const currentCount = results[activeTab].length;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Search header */}
      <div className="sticky top-0 z-10 bg-bg-primary/90 backdrop-blur-xl border-b border-border px-4 md:px-6 py-4">
        <div className="relative max-w-xl">
          <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          {loading && (
            <SpinnerIcon size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Artists, songs, podcasts, albums..."
            autoFocus
            className="w-full h-11 pl-11 pr-11 rounded-xl bg-bg-elevated border border-border
              text-text-primary placeholder:text-text-muted text-sm
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              transition-all duration-150"
          />
        </div>

        {/* Tabs */}
        {searched && (
          <div className="flex gap-1 mt-4 overflow-x-auto no-scrollbar">
            {tabs.map(({ key, label }) => {
              const count = results[key].length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150
                    ${activeTab === key
                      ? 'bg-accent text-bg-primary'
                      : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                    }`}
                >
                  {label}
                  {count > 0 && (
                    <span className={`ml-1.5 text-xs ${activeTab === key ? 'text-bg-primary/70' : 'text-text-muted'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 p-4 md:p-6">
        {!searched && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <SearchIcon size={48} className="text-text-muted mb-4" />
            <h2 className="text-lg font-display font-semibold text-text-primary mb-2">
              Search TIDAL
            </h2>
            <p className="text-text-muted text-sm">
              Find your favorite tracks, albums, and artists
            </p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {searched && !loading && (
          <>
            {/* Tracks tab */}
            {activeTab === 'tracks' && (
              results.tracks.length === 0 ? (
                <EmptyState label="No tracks found" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {results.tracks.map((track, i) => (
                    <TrackCard key={track.id} track={track} queue={results.tracks} index={i} />
                  ))}
                </div>
              )
            )}

            {/* Albums tab */}
            {activeTab === 'albums' && (
              results.albums.length === 0 ? (
                <EmptyState label="No albums found" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {results.albums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              )
            )}

            {/* Artists tab */}
            {activeTab === 'artists' && (
              results.artists.length === 0 ? (
                <EmptyState label="No artists found" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {results.artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              )
            )}

            {/* Playlists tab */}
            {activeTab === 'playlists' && (
              results.playlists.length === 0 ? (
                <EmptyState label="No playlists found" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {results.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.uuid} playlist={playlist} />
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-text-muted">{label}</p>
    </div>
  );
}
