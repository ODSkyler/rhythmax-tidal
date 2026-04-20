import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useSettingsStore } from '../store/playerStore';
import { resolveStreamUrl, isAtmosTrack } from '../api/tidalApi';

let audioEl: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'auto';
    audioEl.crossOrigin = 'anonymous';
  }
  return audioEl;
}

function proxify(url: string) {
  return `https://proxy.rhythmaxapp.workers.dev/?url=${encodeURIComponent(url)}`;
}

export function useAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    repeatMode,
    setCurrentTime,
    setDuration,
    setLoading,
    setBuffering,
    nextTrack,
    seekTo,
  } = usePlayerStore();

  const { audioQuality } = useSettingsStore();

  const loadIdRef = useRef(0);
  const lastTrackKeyRef = useRef<string | null>(null);
  const seekPendingRef = useRef<number | null>(null);
  const endedLockRef = useRef(false);

  const audio = getAudio();

  // 🔥 LOAD TRACK
  useEffect(() => {
    if (!currentTrack) return;

    const key = `${currentTrack.id}-${audioQuality}`;

    if (lastTrackKeyRef.current === key) return;
    lastTrackKeyRef.current = key;

    if (isAtmosTrack(currentTrack)) {
      setTimeout(() => nextTrack(), 0);
      return;
    }

    const myLoadId = ++loadIdRef.current;

    endedLockRef.current = false;

    setLoading(true);
    setBuffering(false);

    audio.pause();
    audio.src = '';
    setDuration(0);
    setCurrentTime(0);

    (async () => {
      try {
        const resolved = await resolveStreamUrl(currentTrack.id, audioQuality);
        if (!resolved || loadIdRef.current !== myLoadId) return;

        let finalUrl: string | null = null;

        if (resolved.isDash) {
          const fallback = await resolveStreamUrl(currentTrack.id, 'LOSSLESS');
          if (!fallback || loadIdRef.current !== myLoadId) return;
          finalUrl = fallback.url;
        } else {
          finalUrl = resolved.url;
        }

        if (!finalUrl || loadIdRef.current !== myLoadId) return;

        audio.src = proxify(finalUrl);
        audio.load();

        if (loadIdRef.current === myLoadId && isPlaying) {
          const p = audio.play();
          if (p) p.catch(() => {});
        }
      } catch (e) {
        console.error('Stream error:', e);
      } finally {
        if (loadIdRef.current === myLoadId) {
          setLoading(false);
        }
      }
    })();
  }, [currentTrack?.id, audioQuality]);

  // 🔥 PLAY / PAUSE
  useEffect(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      const p = audio.play();
      if (p) p.catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // 🔥 VOLUME
  useEffect(() => {
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // 🔥 SEEK
  useEffect(() => {
    seekPendingRef.current = currentTime;
  }, [currentTime]);

  // 🔥 EVENTS (ONLY ONCE)
  useEffect(() => {
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const onCanPlay = () => {
      setLoading(false);
      setBuffering(false);

      if (
        seekPendingRef.current !== null &&
        Math.abs(audio.currentTime - seekPendingRef.current) > 1
      ) {
        audio.currentTime = seekPendingRef.current;
      }
    };

    const onWaiting = () => setBuffering(true);

    const onPlaying = () => {
      setBuffering(false);
      setLoading(false);
    };

    const onEnded = () => {
      console.log('ENDED EVENT 🔥');

      if (endedLockRef.current) {
        console.log('BLOCKED DUPLICATE END');
        return;
      }

      endedLockRef.current = true;

      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        endedLockRef.current = false;
      } else {
        nextTrack();
      }
    };

    const onError = () => {
      setLoading(false);
      setBuffering(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [repeatMode]);

  const seek = useCallback(
    (time: number) => {
      audio.currentTime = time;
      seekTo(time);
    },
    [seekTo]
  );

  return { seek };
}