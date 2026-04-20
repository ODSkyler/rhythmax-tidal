import type {
  Track, Album, Artist, Playlist, PlaylistDetail, ArtistDetail,
  HomeFeed, StreamResponse, ResolvedStream, AudioQuality,
  TrackSearchResult, AlbumSearchResult, ArtistSearchResult, PlaylistSearchResult,
} from './types';
import { getApiInstance, getStreamingInstance } from './instances';

const HOME_FEED_URL = 'https://hot.monochrome.tf';
const COVER_BASE = 'https://resources.tidal.com/images';

// ─── Image URL Helpers ────────────────────────────────────────────────────────

export function getCoverUrl(
  coverId: string | null | undefined,
  size: 80 | 160 | 320 | 640 | 1280 = 320
): string {
  if (!coverId) return '/placeholder.png';
  const path = coverId.replace(/-/g, '/');
  return `${COVER_BASE}/${path}/${size}x${size}.jpg`;
}

export function getArtistImageUrl(pictureId: string | null | undefined, size: 80 | 160 | 320 | 640 = 320): string {
  return getCoverUrl(pictureId, size);
}

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────

const REQUEST_CACHE = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function apiFetch<T>(
  path: string,
  options: { useStreaming?: boolean; cacheTTL?: number } = {}
): Promise<T> {
  const instance = options.useStreaming ? getStreamingInstance() : getApiInstance();
  if (!instance) throw new Error('No active TIDAL instance. Please check Settings.');

  const url = `${instance}${path}`;
  const cacheKey = url;
  const ttl = options.cacheTTL ?? CACHE_TTL;

  if (ttl > 0) {
    const cached = REQUEST_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.ts < ttl) {
      return cached.data as T;
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  const data = await res.json();

  if (ttl > 0) REQUEST_CACHE.set(cacheKey, { data, ts: Date.now() });

  return data as T;
}

// ─── Home Feed ────────────────────────────────────────────────────────────────

export async function getHomeFeed(): Promise<HomeFeed> {
  const cached = REQUEST_CACHE.get(HOME_FEED_URL);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data as HomeFeed;

  const res = await fetch(HOME_FEED_URL);
  if (!res.ok) throw new Error('Failed to load home feed');
  const data = await res.json();
  REQUEST_CACHE.set(HOME_FEED_URL, { data, ts: Date.now() });
  return data as HomeFeed;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchTracks(query: string): Promise<Track[]> {
  const data = await apiFetch<{ data: TrackSearchResult }>(`/search/?s=${encodeURIComponent(query)}`);
  return data.data?.items ?? [];
}

export async function searchAlbums(query: string): Promise<Album[]> {
  const data = await apiFetch<{ data: AlbumSearchResult }>(`/search/?al=${encodeURIComponent(query)}`);
  return data.data?.albums?.items ?? [];
}

export async function searchArtists(query: string): Promise<Artist[]> {
  const data = await apiFetch<{ data: ArtistSearchResult }>(`/search/?a=${encodeURIComponent(query)}`);
  return data.data?.artists?.items ?? [];
}

export async function searchPlaylists(query: string): Promise<Playlist[]> {
  const data = await apiFetch<{ data: PlaylistSearchResult }>(`/search/?p=${encodeURIComponent(query)}`);
  return data.data?.playlists?.items ?? [];
}

// ─── Track ────────────────────────────────────────────────────────────────────

export async function getTrackInfo(trackId: number): Promise<Track> {
  const data = await apiFetch<{ data: Track }>(`/info/?id=${trackId}`);
  return data.data;
}

// ─── Album ────────────────────────────────────────────────────────────────────

export async function getAlbumDetails(albumId: number): Promise<Album> {
  const data = await apiFetch<{ data: Album }>(`/album/?id=${albumId}`);
  return data.data;
}

// ─── Artist ───────────────────────────────────────────────────────────────────

export async function getArtistDetails(artistId: number): Promise<ArtistDetail> {
  const data = await apiFetch<ArtistDetail>(`/artist/?f=${artistId}`);
  return data;
}

// ─── Playlist ─────────────────────────────────────────────────────────────────

export async function getPlaylistDetails(uuid: string): Promise<PlaylistDetail> {
  const data = await apiFetch<PlaylistDetail>(`/playlist/?id=${uuid}`);
  return data;
}

// ─── Streaming ────────────────────────────────────────────────────────────────

const QUALITY_FALLBACK: AudioQuality[] = ['LOSSLESS', 'HIGH', 'LOW'];

export function isAtmosTrack(track: Track): boolean {
  return track.audioModes?.includes('DOLBY_ATMOS') ?? false;
}

export function decodeManifest(manifest: string): { urls: string[]; mimeType: string } | null {
  try {
    const decoded = JSON.parse(atob(manifest));
    return decoded;
  } catch {
    return null;
  }
}

export function parseDashMpd(base64Manifest: string): { initUrl: string; segmentUrls: string[] } | null {
  try {
    const xmlStr = atob(base64Manifest);
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'application/xml');
    const segTemplate = xml.querySelector('SegmentTemplate');
    if (!segTemplate) return null;

    const initUrl = segTemplate.getAttribute('initialization') ?? '';
    const mediaTemplate = segTemplate.getAttribute('media') ?? '';
    const timeline = xml.querySelector('SegmentTimeline');
    if (!timeline) return { initUrl, segmentUrls: [] };

    // Parse segment timeline
    const segments: string[] = [];
    let segNumber = parseInt(segTemplate.getAttribute('startNumber') ?? '1', 10);

    timeline.querySelectorAll('S').forEach((s) => {
      const repeat = parseInt(s.getAttribute('r') ?? '0', 10) + 1;
      for (let i = 0; i < repeat; i++) {
        segments.push(mediaTemplate.replace('$Number$', String(segNumber)));
        segNumber++;
      }
    });

    return { initUrl, segmentUrls: segments };
  } catch {
    return null;
  }
}

export async function resolveStreamUrl(
  trackId: number,
  preferredQuality: AudioQuality
): Promise<ResolvedStream | null> {
  const instance = getStreamingInstance();
  if (!instance) return null;

  // Determine quality fallback chain
  const qualitiesToTry: AudioQuality[] =
    preferredQuality === 'HI_RES_LOSSLESS'
      ? ['HI_RES_LOSSLESS', 'LOSSLESS', 'HIGH', 'LOW']
      : preferredQuality === 'LOSSLESS'
      ? ['LOSSLESS', 'HIGH', 'LOW']
      : preferredQuality === 'HIGH'
      ? ['HIGH', 'LOW']
      : ['LOW'];

      const tried = new Set<AudioQuality>();

const allQualities: AudioQuality[] = [
  ...qualitiesToTry,
  ...QUALITY_FALLBACK,
];

for (const quality of allQualities) {
  if (tried.has(quality)) continue;
  tried.add(quality);

  try {
    const res = await fetch(`${instance}/track/?id=${trackId}&quality=${quality}`);
    if (!res.ok) continue;

    const json = await res.json();
    const stream: StreamResponse = json.data;

    if (stream.manifestMimeType === 'application/vnd.tidal.bts') {
      const manifest = decodeManifest(stream.manifest);
      if (manifest?.urls?.[0]) {
        return {
          url: manifest.urls[0],
          mimeType: manifest.mimeType,
          isDash: false,
          quality,
        };
      }
    } else if (stream.manifestMimeType === 'application/dash+xml') {
      return {
        url: `data:application/dash+xml;base64,${stream.manifest}`,
        mimeType: 'application/dash+xml',
        isDash: true,
        quality,
      };
    }
  } catch {
    continue;
  }
}

return null;
}

export function clearCache(): void {
  REQUEST_CACHE.clear();
}
