// ─── Artist ───────────────────────────────────────────────────────────────────
export interface Artist {
  id: number;
  name: string;
  picture: string | null;
  type: string;
  handle?: string | null;
  userId?: number | null;
  artistTypes?: string[];
  artistRoles?: { categoryId: number; category: string }[];
  mixes?: Record<string, string>;
  spotlighted?: boolean;
  contributionLinkUrl?: string | null;
}

// ─── Album Reference (embedded in tracks) ────────────────────────────────────
export interface AlbumRef {
  id: number;
  title: string;
  cover: string;
  vibrantColor: string | null;
  videoCover: string | null;
  url?: string;
  releaseDate?: string;
}

// ─── Track ────────────────────────────────────────────────────────────────────
export interface Track {
  id: number;
  title: string;
  duration: number;
  explicit: boolean;
  popularity: number;
  streamReady: boolean;
  allowStreaming: boolean;
  adSupportedStreamReady?: boolean;
  audioQuality: 'LOW' | 'HIGH' | 'LOSSLESS' | 'HI_RES_LOSSLESS';
  audioModes: string[];
  artist?: Artist;
  artists: Artist[];
  album: AlbumRef;
  mixes?: Record<string, string>;
  mediaMetadata?: { tags: string[] };
  bpm?: number | null;
  key?: string | null;
  keyScale?: string | null;
  replayGain?: number;
  trackNumber?: number;
  volumeNumber?: number;
  version?: string | null;
  isrc?: string;
  url?: string;
  doublePopularity?: number;
  upload?: boolean;
  payToStream?: boolean;
  accessType?: string | null;
  spotlighted?: boolean;
}

// ─── Album ────────────────────────────────────────────────────────────────────
export interface Album {
  id: number;
  title: string;
  duration: number;
  numberOfTracks: number;
  numberOfVideos?: number;
  numberOfVolumes?: number;
  releaseDate: string;
  copyright?: string | null;
  type?: string;
  version?: string | null;
  cover: string;
  vibrantColor: string | null;
  videoCover?: string | null;
  explicit: boolean;
  audioQuality: string;
  audioModes?: string[];
  popularity?: number;
  streamReady?: boolean;
  allowStreaming?: boolean;
  payToStream?: boolean;
  artist?: Artist;
  artists: Artist[];
  items?: { item: Track; type: string }[];
  url?: string;
  upc?: string;
  mediaMetadata?: { tags: string[] };
  upload?: boolean;
}

// ─── Playlist ─────────────────────────────────────────────────────────────────
export interface Playlist {
  uuid: string;
  title: string;
  description?: string;
  numberOfTracks: number;
  numberOfVideos?: number;
  duration: number;
  image: string;
  squareImage: string;
  type?: string;
  publicPlaylist?: boolean;
  popularity?: number;
  url?: string;
  lastUpdated?: string;
  created?: string;
  lastItemAddedAt?: string | null;
  promotedArtists?: Artist[];
  creators?: unknown[];
  creator?: { id?: number; name?: string } | Record<string, never>;
  customImageUrl?: string | null;
}

// ─── Playlist Detail ──────────────────────────────────────────────────────────
export interface PlaylistDetail {
  playlist: Playlist;
  items: { item: Track }[];
}

// ─── Artist Detail ────────────────────────────────────────────────────────────
export interface ArtistDetail {
  albums: { items: Album[] };
  tracks: Track[];
}

// ─── Home Feed ────────────────────────────────────────────────────────────────
export type SectionType = 'PLAYLIST_LIST' | 'TRACK_LIST' | 'ALBUM_LIST';

export interface Section {
  title: string;
  type: SectionType;
  items: (Playlist | Track | Album)[];
}

export interface HomeFeed {
  top_albums: Album[];
  featured_playlists: Playlist[];
  new_releases: Track[];
  sections: Section[];
}

// ─── Search Results ───────────────────────────────────────────────────────────
export interface TrackSearchResult {
  limit: number;
  offset: number;
  totalNumberOfItems: number;
  items: Track[];
}

export interface AlbumSearchResult {
  albums: { items: Album[]; totalNumberOfItems: number };
  artists: { items: Artist[]; totalNumberOfItems: number };
}

export interface ArtistSearchResult {
  artists: { items: Artist[]; totalNumberOfItems: number };
}

export interface PlaylistSearchResult {
  playlists: { items: Playlist[]; totalNumberOfItems: number };
}

// ─── Streaming ────────────────────────────────────────────────────────────────
export type AudioQuality = 'LOW' | 'HIGH' | 'LOSSLESS' | 'HI_RES_LOSSLESS';

export interface StreamManifestData {
  mimeType: string;
  codecs?: string;
  encryptionType: string;
  urls: string[];
}

export interface StreamResponse {
  trackId: number;
  assetPresentation: string;
  audioMode: string;
  audioQuality: AudioQuality;
  manifestMimeType: 'application/vnd.tidal.bts' | 'application/dash+xml';
  manifestHash: string;
  manifest: string; // base64 encoded
  albumReplayGain?: number;
  trackReplayGain?: number;
  bitDepth?: number;
  sampleRate?: number;
}

export interface ResolvedStream {
  url: string;
  mimeType: string;
  isDash: boolean;
  quality: AudioQuality;
}

// ─── Instance ─────────────────────────────────────────────────────────────────
export interface Instance {
  url: string;
  version: string;
}

export interface UptimeResponse {
  lastUpdated: string;
  api: Instance[];
  streaming: Instance[];
  down: Instance[];
}

// ─── Player Queue ─────────────────────────────────────────────────────────────
export interface QueueItem extends Track {
  queueId: string; // unique per queue entry to support duplicates
}
