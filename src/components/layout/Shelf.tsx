import React, { useRef } from 'react';
import { ChevronRight } from '../ui/Icons';

interface ShelfProps {
  title: string;
  children: React.ReactNode;
  onSeeAll?: () => void;
  itemMinWidth?: string;
}

export function Shelf({ title, children, onSeeAll, itemMinWidth = '160px' }: ShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-display font-semibold text-text-primary">{title}</h2>
        <div className="flex items-center gap-2">
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-xs text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
            >
              See all <ChevronRight size={14} />
            </button>
          )}
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex w-7 h-7 rounded-full bg-bg-elevated hover:bg-bg-hover
              items-center justify-center transition-colors"
          >
            <ChevronRight size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {React.Children.map(children, (child) => (
          <div
            className="flex-shrink-0"
            style={{ width: itemMinWidth, scrollSnapAlign: 'start' }}
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}

interface GridProps {
  title?: string;
  children: React.ReactNode;
  columns?: string;
}

export function Grid({ title, children, columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' }: GridProps) {
  return (
    <section className="mb-8">
      {title && (
        <h2 className="text-base font-display font-semibold text-text-primary mb-4 px-1">{title}</h2>
      )}
      <div className={`grid ${columns} gap-3`}>
        {children}
      </div>
    </section>
  );
}
