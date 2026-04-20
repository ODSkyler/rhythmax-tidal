import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { getCoverUrl } from '../../api/tidalApi';
import { formatDuration, formatArtists } from '../../lib/utils';
import { CloseIcon, DotsIcon, PlayIcon } from '../ui/Icons';

export function QueuePanel() {
  const { queue, currentTrack, showQueue, toggleQueue, playQueueItem, removeFromQueue } = usePlayerStore();

  if (!showQueue) return null;

  return (
    <div className="w-72 xl:w-80 flex-shrink-0 border-l border-border bg-bg-surface
      flex flex-col h-full overflow-hidden animate-slide-in-right">
      <div className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
        <h3 className="font-display font-semibold text-text-primary text-sm">Queue</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">{queue.length} tracks</span>
          <button
            onClick={toggleQueue}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-text-muted text-sm">Queue is empty</p>
            <p className="text-text-muted text-xs mt-1">Play tracks to add them here</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {queue.map((item, idx) => {
              const isActive = item.queueId === currentTrack?.queueId;
              return (
                <div
                  key={item.queueId}
                  className={`group flex items-center gap-2.5 p-2 rounded-xl transition-all duration-150 cursor-pointer
                    ${isActive ? 'bg-accent-dim' : 'hover:bg-bg-hover'}`}
                  onClick={() => playQueueItem(item.queueId)}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden relative">
                    <img
                      src={getCoverUrl(item.album?.cover, 80)}
                      alt={item.album?.title}
                      className="w-full h-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex items-end gap-0.5 h-3">
                          <div className="equalizer-bar" style={{ width: '2px', animationDelay: '0s' }} />
                          <div className="equalizer-bar" style={{ width: '2px', animationDelay: '0.2s' }} />
                          <div className="equalizer-bar" style={{ width: '2px', animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium line-clamp-1 ${isActive ? 'text-accent' : 'text-text-primary'}`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-text-muted line-clamp-1">
                      {formatArtists(item.artists)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[10px] text-text-muted font-mono">
                      {formatDuration(item.duration)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(item.queueId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-muted
                        hover:text-text-primary transition-all"
                    >
                      <CloseIcon size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
