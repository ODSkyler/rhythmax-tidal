import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

const iconProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
});

export const PlayIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M8 5.14v14l11-7-11-7z" fill="currentColor" />
  </svg>
);

export const PauseIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
  </svg>
);

export const SkipNextIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" fill="currentColor" />
  </svg>
);

export const SkipPrevIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" fill="currentColor" />
  </svg>
);

export const ShuffleIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" fill="currentColor" />
  </svg>
);

export const RepeatIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" fill="currentColor" />
  </svg>
);

export const RepeatOneIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v6H13z" fill="currentColor" />
  </svg>
);

export const VolumeIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor" />
  </svg>
);

export const MuteIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor" />
  </svg>
);

export const QueueIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" fill="currentColor" />
  </svg>
);

export const HomeIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
  </svg>
);

export const SearchIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" />
  </svg>
);

export const LibraryIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 10H9V8h6v4zm2-2h-1v-3H9v3H8V7h9v3z" fill="currentColor" />
  </svg>
);

export const SettingsIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor" />
  </svg>
);

export const ChevronDown = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor" />
  </svg>
);

export const ChevronRight = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
  </svg>
);

export const CloseIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
  </svg>
);

export const HeartIcon = ({ size = 24, className = '', filled = false }: IconProps & { filled?: boolean }) => (
  <svg {...iconProps(size)} className={className}>
    {filled ? (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
    ) : (
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill="currentColor" />
    )}
  </svg>
);

export const DotsIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <circle cx="12" cy="5" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="19" r="2" fill="currentColor" />
  </svg>
);

export const ExplicitIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
    <path d="M7 7h10v2H9v2h6v2H9v2h8v2H7V7z" fill="#070709" />
  </svg>
);

export const AddToQueueIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h12v2H3v-2zm16-5h2v2h-2v2h-2v-2h-2v-2h2v-2h2v2z" fill="currentColor" />
  </svg>
);

export const SpinnerIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={`animate-spin ${className}`}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="20" />
  </svg>
);

export const MenuIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
  </svg>
);

export const AlbumIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" fill="currentColor" />
  </svg>
);

export const MicIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg {...iconProps(size)} className={className}>
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="currentColor" />
  </svg>
);
