export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDurationLong(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} hr ${m} min`;
  return `${m} min`;
}

export function formatArtists(artists: { name: string }[]): string {
  return artists.map((a) => a.name).join(', ');
}

export function formatReleaseYear(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear().toString();
}

export function generateQueueId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function debounce<T extends (...args: string[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function getQualityLabel(quality: string): string {
  const labels: Record<string, string> = {
    LOW: 'Normal • AAC 96kbps',
    HIGH: 'High • AAC 320kbps',
    LOSSLESS: 'Lossless • FLAC 16-bit',
    HI_RES_LOSSLESS: 'Hi-Res • FLAC 24-bit',
  };
  return labels[quality] ?? quality;
}

export function getQualityBadge(tags?: string[]): string | null {
  if (!tags) return null;
  if (tags.includes('HIRES_LOSSLESS')) return 'HI-RES';
  if (tags.includes('LOSSLESS')) return 'LOSSLESS';
  if (tags.includes('DOLBY_ATMOS')) return 'ATMOS';
  return null;
}

export function lightenColor(hex: string, amount = 0.3): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
    const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return hex;
  }
}

export function hexToRgba(hex: string, alpha = 1): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(0,0,0,${alpha})`;
  }
}
