import React, { useCallback, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { getCoverUrl } from '../../api/tidalApi';
import { formatDuration, formatArtists } from '../../lib/utils';
import {
  PlayIcon, PauseIcon, SkipNextIcon, SkipPrevIcon,
  ShuffleIcon, RepeatIcon, RepeatOneIcon, VolumeIcon, MuteIcon,
  QueueIcon, SpinnerIcon,
} from '../ui/Icons';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export function MiniPlayer() {
  const {
    currentTrack, isPlaying, isLoading, isBuffering,
    currentTime, duration, volume, isMuted,
    shuffleOn, repeatMode, queue,
    togglePlay, nextTrack, prevTrack,
    setVolume, toggleMute, toggleShuffle, cycleRepeat,
    setFullPlayer, toggleQueue,
  } = usePlayerStore();

  const { seek } = useAudioPlayer();
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  }, [duration, seek]);

  if (!currentTrack) return null;

  const coverUrl = getCoverUrl(currentTrack.album?.cover, 160);
  const isActive = isLoading || isBuffering;

  return (
    <div className="flex-shrink-0 bg-bg-surface/95 backdrop-blur-xl border-t border-border
      shadow-player animate-slide-up z-50">
      {/* Progress bar — clickable thin strip at top */}
      <div
        ref={progressRef}
        className="track-progress w-full h-1 cursor-pointer rounded-none"
        onClick={handleProgressClick}
      >
        <div
          className="track-progress-fill h-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center h-16 md:h-20 px-3 md:px-6 gap-3 md:gap-6">
        {/* Track info */}
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => setFullPlayer(true)}
        >
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={coverUrl}
              alt={currentTrack.album?.title}
              className="w-full h-full object-cover"
            />
            {isActive && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <SpinnerIcon size={16} className="text-accent" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary line-clamp-1">{currentTrack.title}</p>
            <p className="text-xs text-text-secondary line-clamp-1">
              {formatArtists(currentTrack.artists)}
            </p>
          </div>
        </div>

        {/* Center controls */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-1 md:gap-3">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`hidden md:flex p-1.5 rounded-lg transition-colors
                ${shuffleOn ? 'text-accent' : 'text-text-muted hover:text-text-secondary'}`}
            >
              <ShuffleIcon size={16} />
            </button>

            <button
              onClick={prevTrack}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              <SkipPrevIcon size={22} />
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-accent flex items-center justify-center
                hover:bg-accent-bright transition-colors shadow-glow-sm"
            >
              {isActive ? (
                <SpinnerIcon size={18} className="text-bg-primary" />
              ) : isPlaying ? (
                <PauseIcon size={20} className="text-bg-primary" />
              ) : (
                <PlayIcon size={20} className="text-bg-primary ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              <SkipNextIcon size={22} />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`hidden md:flex p-1.5 rounded-lg transition-colors
                ${repeatMode !== 'off' ? 'text-accent' : 'text-text-muted hover:text-text-secondary'}`}
            >
              {repeatMode === 'one' ? <RepeatOneIcon size={16} /> : <RepeatIcon size={16} />}
            </button>
          </div>

          {/* Time */}
          <div className="hidden md:flex items-center gap-2 text-[10px] text-text-muted font-mono">
            <span>{formatDuration(currentTime)}</span>
            <span>/</span>
            <span>{formatDuration(duration || currentTrack.duration)}</span>
          </div>
        </div>

        {/* Right: volume + queue */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={toggleQueue}
            className={`p-1.5 rounded-lg transition-colors relative
              ${usePlayerStore.getState().showQueue ? 'text-accent' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <QueueIcon size={18} />
            {queue.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent text-bg-primary
                text-[8px] rounded-full flex items-center justify-center font-mono">
                {queue.length > 99 ? '99+' : queue.length}
              </span>
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary transition-colors"
          >
            {isMuted ? <MuteIcon size={18} /> : <VolumeIcon size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24"
            style={{
              background: `linear-gradient(to right, #02D4A0 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
