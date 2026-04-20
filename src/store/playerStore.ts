let nextTrackLock = false;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track, AudioQuality } from '../api/types';
import { generateQueueId, shuffleArray } from '../lib/utils';

export interface QueueItem extends Track {
  queueId: string;
}

type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  // Current playback
  currentTrack: QueueItem | null;
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;

  // Queue
  queue: QueueItem[];
  queueIndex: number;
  originalQueue: QueueItem[];

  // Modes
  shuffleOn: boolean;
  repeatMode: RepeatMode;

  // UI state
  showFullPlayer: boolean;
  showQueue: boolean;

  // Actions
  playTrack: (track: Track, queue?: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setLoading: (loading: boolean) => void;
  setBuffering: (buffering: boolean) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setFullPlayer: (show: boolean) => void;
  toggleQueue: () => void;
  removeFromQueue: (queueId: string) => void;
  addToQueue: (track: Track) => void;
  playQueueItem: (queueId: string) => void;
  clearQueue: () => void;
}

interface SettingsState {
  audioQuality: AudioQuality;
  dataSaver: boolean;
  setAudioQuality: (q: AudioQuality) => void;
  setDataSaver: (v: boolean) => void;
}

// ─── Player Store ─────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  isBuffering: false,
  currentTime: 0,
  duration: 0,
  volume: 0.85,
  isMuted: false,
  queue: [],
  queueIndex: 0,
  originalQueue: [],
  shuffleOn: false,
  repeatMode: 'off',
  showFullPlayer: false,
  showQueue: false,

  playTrack: (track, queue, startIndex = 0) => {
    const queueId = generateQueueId();
    const queueItem: QueueItem = { ...track, queueId };

    let finalQueue: QueueItem[];
    let finalIndex = 0;

    if (queue && queue.length > 0) {
      const mapped = queue.map((t, i) => {
        const id = generateQueueId();
        if (i === startIndex) {
          finalIndex = i;
          return { ...t, queueId: t.id === track.id ? queueId : id };
        }
        return { ...t, queueId: id };
      });
      finalQueue = mapped;
      // Ensure the played item has same queueId
      const playedItem = finalQueue.find((q) => q.id === track.id && q.queueId === queueId);
      if (!playedItem) {
        finalQueue[startIndex] = { ...track, queueId };
        finalIndex = startIndex;
      }
    } else {
      finalQueue = [queueItem];
      finalIndex = 0;
    }

    set({
      currentTrack: { ...track, queueId },
      queue: finalQueue,
      queueIndex: finalIndex,
      originalQueue: finalQueue,
      isPlaying: true,
      isLoading: true,
      currentTime: 0,
      duration: 0,
    });
  },

  togglePlay: () => {
    set((s) => ({ isPlaying: !s.isPlaying }));
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  nextTrack: () => {
  if (nextTrackLock) return;
  nextTrackLock = true;

  setTimeout(() => {
    nextTrackLock = false;
  }, 300); // small debounce

  set((state) => {
    const { queue, queueIndex, repeatMode } = state;
    if (queue.length === 0) return state;

    if (repeatMode === 'one') {
      return {
        currentTime: 0,
        isPlaying: true,
      };
    }

    const nextIndex = state.queueIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        return {
          currentTrack: queue[0],
          queueIndex: 0,
          currentTime: 0,
          isLoading: true,
          isPlaying: true,
        };
      } else {
        return {
          isPlaying: false,
          currentTime: 0,
        };
      }
    }

    return {
      currentTrack: queue[nextIndex],
      queueIndex: nextIndex,
      currentTime: 0,
      isLoading: true,
      isPlaying: true,
    };
  });
},

  prevTrack: () => {
    const { queue, queueIndex, currentTime } = get();
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    if (queueIndex <= 0) return;
    const prev = queue[queueIndex - 1];
    set({ currentTrack: prev, queueIndex: queueIndex - 1, currentTime: 0, isLoading: true, isPlaying: true });
  },

  seekTo: (time) => {
    set({ currentTime: time });
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setLoading: (isLoading) => set({ isLoading }),
  setBuffering: (isBuffering) => set({ isBuffering }),

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  toggleShuffle: () => {
    const { shuffleOn, originalQueue, queue, queueIndex, currentTrack } = get();
    if (!shuffleOn) {
      // Shuffle the remaining queue after current
      const current = currentTrack;
      const before = queue.slice(0, queueIndex + 1);
      const after = shuffleArray(queue.slice(queueIndex + 1));
      const shuffled = [...before, ...after];
      set({ shuffleOn: true, queue: shuffled, originalQueue: queue });
    } else {
      // Restore original order, find current track position
      const orig = originalQueue;
      const newIndex = orig.findIndex((q) => q.queueId === currentTrack?.queueId);
      set({ shuffleOn: false, queue: orig, queueIndex: newIndex >= 0 ? newIndex : queueIndex });
    }
  },

  cycleRepeat: () => {
    set((s) => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const next = modes[(modes.indexOf(s.repeatMode) + 1) % modes.length];
      return { repeatMode: next };
    });
  },

  setFullPlayer: (show) => set({ showFullPlayer: show }),
  toggleQueue: () => set((s) => ({ showQueue: !s.showQueue })),

  addToQueue: (track) => {
    const queueId = generateQueueId();
    set((s) => ({ queue: [...s.queue, { ...track, queueId }] }));
  },

  removeFromQueue: (queueId) => {
    set((s) => {
      const newQueue = s.queue.filter((q) => q.queueId !== queueId);
      const newIndex = newQueue.findIndex((q) => q.queueId === s.currentTrack?.queueId);
      return { queue: newQueue, queueIndex: Math.max(0, newIndex) };
    });
  },

  playQueueItem: (queueId) => {
    const { queue } = get();
    const idx = queue.findIndex((q) => q.queueId === queueId);
    if (idx < 0) return;
    set({ currentTrack: queue[idx], queueIndex: idx, isPlaying: true, isLoading: true, currentTime: 0 });
  },

  clearQueue: () => {
    set({ queue: [], queueIndex: 0, originalQueue: [] });
  },
}));

// ─── Settings Store ───────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audioQuality: 'LOSSLESS',
      dataSaver: false,
      setAudioQuality: (audioQuality) => set({ audioQuality }),
      setDataSaver: (dataSaver) => set({ dataSaver }),
    }),
    {
      name: 'rhythmax-settings',
    }
  )
);
