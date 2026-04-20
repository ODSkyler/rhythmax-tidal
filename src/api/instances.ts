import type { Instance, UptimeResponse } from './types';

const UPTIME_URL = 'https://tidal-uptime.props-76styles.workers.dev/';
const STORAGE_KEY = 'rhythmax_instance';
const STORAGE_STREAMING_KEY = 'rhythmax_streaming_instance';

let cachedApiInstance: string | null = null;
let cachedStreamingInstance: string | null = null;

export async function fetchInstances(): Promise<{ api: Instance[]; streaming: Instance[] }> {
  try {
    const res = await fetch(UPTIME_URL);
    const data: UptimeResponse = await res.json();
    return {
      api: data.api || [],
      streaming: data.streaming || [],
    };
  } catch {
    return { api: [], streaming: [] };
  }
}

async function testInstance(url: string, timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    await fetch(`${url}/search/?s=test`, { signal: controller.signal });
    clearTimeout(id);
    return true;
  } catch {
    return false;
  }
}

export async function discoverBestInstance(): Promise<string | null> {
  // Check cache first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const ok = await testInstance(stored, 3000);
    if (ok) {
      cachedApiInstance = stored;
      return stored;
    }
  }

  const { api } = await fetchInstances();
  
  // Prefer v2.8 instances
  const sorted = [...api].sort((a, b) => {
    const av = parseFloat(a.version);
    const bv = parseFloat(b.version);
    return bv - av;
  });

  for (const instance of sorted) {
    const ok = await testInstance(instance.url, 4000);
    if (ok) {
      cachedApiInstance = instance.url;
      localStorage.setItem(STORAGE_KEY, instance.url);
      return instance.url;
    }
  }
  return null;
}

export async function discoverBestStreamingInstance(): Promise<string | null> {
  const stored = localStorage.getItem(STORAGE_STREAMING_KEY);
  if (stored) {
    cachedStreamingInstance = stored;
    return stored;
  }

  const { streaming } = await fetchInstances();
  const sorted = [...streaming].sort((a, b) => parseFloat(b.version) - parseFloat(a.version));

  for (const instance of sorted) {
    cachedStreamingInstance = instance.url;
    localStorage.setItem(STORAGE_STREAMING_KEY, instance.url);
    return instance.url; // Just use the first available streaming instance
  }
  return null;
}

export function getApiInstance(): string | null {
  return cachedApiInstance || localStorage.getItem(STORAGE_KEY);
}

export function getStreamingInstance(): string | null {
  return cachedStreamingInstance || localStorage.getItem(STORAGE_STREAMING_KEY) || getApiInstance();
}

export function clearInstanceCache(): void {
  cachedApiInstance = null;
  cachedStreamingInstance = null;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_STREAMING_KEY);
}
