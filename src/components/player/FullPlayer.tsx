import React, { useCallback, useRef, useEffect, useState } from 'react';
import '../../lib/am-lyrics.js';
import { usePlayerStore } from '../../store/playerStore';
import { getCoverUrl } from '../../api/tidalApi';
import { formatDuration, hexToRgba, getQualityLabel, formatArtists } from '../../lib/utils';
import {
  PlayIcon, PauseIcon, SkipNextIcon, SkipPrevIcon,
  ShuffleIcon, RepeatIcon, RepeatOneIcon, VolumeIcon, MuteIcon,
  ChevronDown, HeartIcon, DotsIcon, QueueIcon, SpinnerIcon, ExplicitIcon,
} from '../ui/Icons';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export function FullPlayer() {
  const {
    currentTrack, isPlaying, isLoading, isBuffering,
    currentTime, duration, volume, isMuted,
    shuffleOn, repeatMode, showFullPlayer,
    togglePlay, nextTrack, prevTrack,
    setVolume, toggleMute, toggleShuffle, cycleRepeat,
    setFullPlayer, toggleQueue,
  } = usePlayerStore();

  const { seek } = useAudioPlayer();
  const progressRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const lyricsRef = useRef<any>(null);
  const [showLyrics, setShowLyrics] = useState(true);

  useEffect(() => { setImgError(false); }, [currentTrack?.id]);
  useEffect(() => {
  if (!lyricsRef.current || !currentTrack || !showFullPlayer) return;

  const el = lyricsRef.current;

  // ⏳ wait for component to mount properly
  const timeout = setTimeout(() => {
    el.songTitle = currentTrack.title;

    // 🔥 FIX: use ALL artists (better matching)
    el.songArtist = currentTrack.artists
      ?.map(a => a.name)
      .join(', ');

    el.songAlbum = currentTrack.album?.title;
    el.songDuration = currentTrack.duration * 1000;
  }, 150);

  return () => clearTimeout(timeout);
}, [currentTrack?.id, showFullPlayer, showLyrics]);

useEffect(() => {
  if (!showLyrics || !lyricsRef.current || !currentTrack) return;

  const el = lyricsRef.current;

  const timeout = setTimeout(() => {
    el.songTitle = currentTrack.title;
    el.songArtist = currentTrack.artists?.map(a => a.name).join(', ');
    el.songAlbum = currentTrack.album?.title;
    el.songDuration = currentTrack.duration * 1000;
  }, 150);

  return () => clearTimeout(timeout);
}, [showLyrics]);

useEffect(() => {
  if (!lyricsRef.current) return;

  lyricsRef.current.currentTime = currentTime * 1000;
}, [currentTime]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const vibrantColor = currentTrack?.album?.vibrantColor ?? '#02D4A0';

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  }, [duration, seek]);

  if (!currentTrack || !showFullPlayer) return null;

  const coverUrl = imgError ? '/placeholder.png' : getCoverUrl(currentTrack.album?.cover, 640);
  const quality = currentTrack.mediaMetadata?.tags?.includes('HIRES_LOSSLESS')
    ? 'HI_RES_LOSSLESS'
    : currentTrack.audioQuality;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden animate-fade-in">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, ${hexToRgba(vibrantColor, 0.35)} 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, ${hexToRgba(vibrantColor, 0.2)} 0%, transparent 60%),
            #070709
          `,
        }}
      />

      {/* Blurred album art as background */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={coverUrl}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-110"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <button
            onClick={() => setFullPlayer(false)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center
              text-text-secondary transition-all"
          >
            <ChevronDown size={22} />
          </button>
          <div className="text-center">
            <p className="text-xs text-text-muted uppercase tracking-widest font-mono">Now Playing</p>
          </div>
          <button
  onClick={() => setShowLyrics((v) => !v)}
  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary transition-all"
>
  {showLyrics ? '🎤' : '🎤'}
</button>
          <button
            onClick={toggleQueue}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center
              text-text-secondary transition-all"
          >
            <QueueIcon size={18} />
          </button>
        </div>

        {/* Main content */}
<div
  className={`
    flex-1 flex flex-col 
    ${showLyrics ? 'lg:flex-row lg:items-center lg:justify-center' : 'items-center justify-center'}
    gap-12 px-6 md:px-12 overflow-hidden
  `}
>

  {/* LEFT SIDE (Album + Controls stacked) */}
  <div className={`flex flex-col w-full ${showLyrics ? 'max-w-md' : 'max-w-lg items-center'} gap-6`}>

    {/* Album art */}
    <div className="w-full">
      <div
        className={`aspect-square rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]
        ${isPlaying ? 'animate-pulse-glow' : ''}`}
        style={{ animationDuration: '3s' }}
      >
        <img
          src={coverUrl}
          alt={currentTrack.album?.title}
          className={`w-full h-full object-cover transition-transform duration-700
          ${isPlaying ? 'scale-105' : 'scale-100'}`}
          onError={() => setImgError(true)}
        />
      </div>
    </div>

    {/* Controls panel */}
    <div className="w-full flex flex-col gap-6">

      {/* Track info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {currentTrack.explicit && <ExplicitIcon size={14} className="text-text-muted flex-shrink-0" />}
            <h1 className="text-2xl font-display font-bold text-text-primary line-clamp-2 leading-tight">
              {currentTrack.title}
            </h1>
          </div>
          <p className="text-text-secondary text-base">
            {formatArtists(currentTrack.artists)}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {currentTrack.album?.title}
          </p>
        </div>
        <button
          onClick={() => setLiked(!liked)}
          className="flex-shrink-0 p-2 text-text-muted hover:text-red-400 transition-colors"
        >
          <HeartIcon size={22} filled={liked} className={liked ? 'text-red-400' : ''} />
        </button>
      </div>

      {/* Quality badge */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-md bg-accent-dim border border-accent/20
          text-accent text-[10px] font-mono font-medium tracking-wider">
          {quality}
        </span>
        <span className="text-xs text-text-muted">{getQualityLabel(quality)}</span>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div
          ref={progressRef}
          className="track-progress w-full h-1.5 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="track-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted font-mono">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration || currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-xl transition-colors
            ${shuffleOn ? 'text-accent bg-accent-dim' : 'text-text-muted hover:text-text-secondary'}`}
        >
          <ShuffleIcon size={20} />
        </button>

        <button onClick={prevTrack} className="p-2 text-text-secondary hover:text-text-primary">
          <SkipPrevIcon size={32} />
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-accent hover:bg-accent-bright
          flex items-center justify-center shadow-glow-accent transition-all active:scale-95"
        >
          {isLoading || isBuffering ? (
            <SpinnerIcon size={28} className="text-bg-primary" />
          ) : isPlaying ? (
            <PauseIcon size={28} className="text-bg-primary" />
          ) : (
            <PlayIcon size={28} className="text-bg-primary ml-1" />
          )}
        </button>

        <button onClick={nextTrack} className="p-2 text-text-secondary hover:text-text-primary">
          <SkipNextIcon size={32} />
        </button>

        <button
          onClick={cycleRepeat}
          className={`p-2 rounded-xl transition-colors
            ${repeatMode !== 'off' ? 'text-accent bg-accent-dim' : 'text-text-muted hover:text-text-secondary'}`}
        >
          {repeatMode === 'one' ? <RepeatOneIcon size={20} /> : <RepeatIcon size={20} />}
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <button onClick={toggleMute} className="text-text-muted hover:text-text-secondary">
          {isMuted ? <MuteIcon size={18} /> : <VolumeIcon size={18} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1"
        />
      </div>

    </div>
  </div>

  {/* RIGHT SIDE (LYRICS) */}
 {showLyrics && (
 <div className="flex-1 h-full flex items-center justify-center max-w-3xl">
    <div className="w-full max-w-3xl h-full overflow-hidden px-4">
      <am-lyrics
        key={currentTrack?.id}
        ref={lyricsRef}
        highlight-color="#02D4A0"
        autoscroll
        interpolate
      />
    </div>
  </div>
)}

</div>
      </div>
    </div>
  );
}
