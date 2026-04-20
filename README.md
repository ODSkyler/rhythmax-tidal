# 🎵 Rhythmax Web Player

A modern music streaming web app using publicly available community-powered APIs for TIDAL.

---
> ⚠️ **Disclaimer**
> This project is for educational purposes only. It is not affiliated with, endorsed by, or connected to TIDAL. All trademarks and copyrights belong to their respective owners.
---

## ✨ Features

| Feature | Details |
|---|---|
| 🏠 Home Feed | Real-time TIDAL home feed — top albums, new releases, featured playlists, curated sections |
| 🔍 Smart Search | Debounced multi-category search (tracks, albums, artists, playlists) |
| 🎵 Full Player | Full-screen player with animated gradient background from album art |
| 📦 Queue System | Global queue — add, remove, reorder, play from any position |
| 💿 Album Pages | Full tracklists, play all / shuffle all |
| 👤 Artist Pages | Top tracks + full discography grid |
| 📂 Playlist Pages | Playlist metadata + complete track list |
| ⚙️ Settings | Quality tiers (LOW/HIGH/LOSSLESS/HI_RES_LOSSLESS), data saver, theme toggle |
| 📱 Responsive | Mobile, tablet, desktop and TV/large screen adaptive layouts |
| 🔊 Smart Streaming | Auto quality fallback, Dolby Atmos skip, stale-response prevention |
| 🎨 Glassmorphism | Blur effects, vibrant color extraction, noise overlays |
| ⚡ Performance | Lazy-loaded pages, response caching, virtualization-ready list |

---

## 🏗️ Architecture

```
rhythmax/
├── public/
│   ├── favicon.svg
│   └── placeholder.png
└── src/
    ├── api/
    │   ├── types.ts          # All TypeScript interfaces
    │   ├── instances.ts      # TIDAL instance discovery + caching
    │   └── tidalApi.ts       # Full API service layer
    ├── store/
    │   └── playerStore.ts    # Zustand global player + settings state
    ├── hooks/
    │   ├── useAudioPlayer.ts # Core audio engine (singleton HTMLAudioElement)
    │   └── useInstanceInit.ts # Boot-time instance discovery hook
    ├── lib/
    │   └── utils.ts          # Pure utility helpers
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx   # Collapsible sidebar + mobile bottom nav
    │   │   ├── TopBar.tsx    # Search bar + header
    │   │   └── Shelf.tsx     # Horizontal scroll shelf + grid
    │   ├── player/
    │   │   ├── MiniPlayer.tsx  # Persistent mini player bar
    │   │   ├── FullPlayer.tsx  # Full-screen overlay player
    │   │   └── QueuePanel.tsx  # Side queue panel
    │   ├── cards/
    │   │   ├── TrackCard.tsx   # Grid card for tracks
    │   │   ├── AlbumCard.tsx   # Grid card for albums
    │   │   ├── PlaylistCard.tsx # Grid card for playlists
    │   │   ├── ArtistCard.tsx  # Circular artist card
    │   │   └── TrackRow.tsx    # List row for album/playlist tracks
    │   └── ui/
    │       ├── Icons.tsx       # All inline SVG icons
    │       └── Skeleton.tsx    # Skeleton loaders
    ├── pages/
    │   ├── HomePage.tsx        # Home feed with hero banner
    │   ├── SearchPage.tsx      # Multi-tab search results
    │   ├── AlbumPage.tsx       # Album detail + tracks
    │   ├── ArtistPage.tsx      # Artist detail + discography
    │   ├── PlaylistPage.tsx    # Playlist detail + tracks
    │   └── SettingsPage.tsx    # Quality, theme, data saver
    ├── App.tsx                 # Root layout + routing
    ├── main.tsx                # React entry point
    └── index.css               # Tailwind + global styles
```

## 🌐 Streaming Architecture

Rhythmax uses a proxy-based streaming system to handle CORS restrictions:

User → Cloudflare Pages (frontend)  
→ Cloudflare Worker (proxy)  
→ TIDAL CDN  

This ensures smooth playback while maintaining browser compatibility.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Dev
```bash
cd rhythmax
npm install
npm run dev
```
Open http://localhost:5173

### Production Build
```bash
npm run build
npm run preview   # Preview the production build
```

---

## 🎨 Design System

| Token | Value | Purpose |
|---|---|---|
| `bg-primary` | `#070709` | App background |
| `bg-surface` | `#0F0F14` | Sidebar, player bar |
| `bg-elevated` | `#17171E` | Cards, inputs |
| `accent` | `#02D4A0` | Primary interactive color |
| `text-primary` | `#ECEBF5` | Headings, track names |
| `text-secondary` | `#7A79A0` | Artists, subtitles |
| `text-muted` | `#4A4965` | Timestamps, metadata |

**Fonts:**
- Display: [Sora](https://fonts.google.com/specimen/Sora) — headings, logo
- Body: [DM Sans](https://fonts.google.com/specimen/DM+Sans) — UI text
- Mono: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — time, codes

---

## 🔌 API Layer

### Endpoints Used
| Endpoint | Used For |
|---|---|
| `https://tidal-uptime.props-76styles.workers.dev/` | Instance discovery |
| `https://hot.monochrome.tf` | Home feed |
| `/search/?s={q}` | Track search |
| `/search/?al={q}` | Album search |
| `/search/?a={q}` | Artist search |
| `/search/?p={q}` | Playlist search |
| `/info/?id={id}` | Track metadata |
| `/track/?id={id}&quality={q}` | Stream manifest |
| `/album/?id={id}` | Album + tracks |
| `/artist/?f={id}` | Artist + discography |
| `/playlist/?id={uuid}` | Playlist + tracks |
| `https://resources.tidal.com/images/{id}/{px}x{px}.jpg` | Cover art |

### Quality Tiers
| Quality | Codec | Bitrate |
|---|---|---|
| `LOW` | AAC (HE-AACv1) | ~96 kbps |
| `HIGH` | AAC-LC | ~320 kbps |
| `LOSSLESS` | FLAC 16-bit | ~1,411 kbps |
| `HI_RES_LOSSLESS` | FLAC 24-bit (DASH) | ~2,000-5,000 kbps |

> **Note:** `HI_RES_LOSSLESS` uses DASH MPD delivery. The player currently falls back to `LOSSLESS` for browser compatibility. Dolby Atmos tracks are automatically skipped with a graceful fallback.

---

## 🧠 State Management

All player state lives in a single **Zustand** store (`playerStore.ts`):

```ts
// Play a track (with optional queue context)
usePlayerStore.getState().playTrack(track, queue, startIndex)

// Global controls
togglePlay() | nextTrack() | prevTrack()
toggleShuffle() | cycleRepeat()
setVolume(0..1) | toggleMute()

// Queue management
addToQueue(track) | removeFromQueue(queueId) | playQueueItem(queueId)
```

Settings are persisted in `localStorage` via Zustand persist middleware.

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` | Sidebar hidden, bottom nav visible, mini player compact |
| `768px+` | Full sidebar, no bottom nav |
| `1024px+` | Queue panel can open alongside content |
| `1280px+` | Wider grid columns, larger album art in full player |
| `1920px+` | Max content width reached |

---

## 🔧 Environment Notes

- No `.env` required — all API endpoints are public
- Instance discovery is cached in `localStorage` for fast subsequent loads
- API responses are cached in-memory for 5 minutes
- The app uses a singleton `HTMLAudioElement` to prevent multiple audio contexts

---

## 🚀 Deployment

The app is deployed using:

- Frontend: Cloudflare Pages
- Backend Proxy: Cloudflare Workers

To deploy manually:

```bash
npm run build

## 🛣️ Extending Rhythmax

### Adding a new page
1. Create `src/pages/NewPage.tsx`
2. Add a lazy import in `App.tsx`
3. Add a `<Route>` inside `<Routes>`
4. (Optional) Add to sidebar nav in `Sidebar.tsx`

### Adding a new API endpoint
1. Add the TypeScript interface to `src/api/types.ts`
2. Add the fetch function to `src/api/tidalApi.ts` using `apiFetch<T>()`
3. Use it in a page component or hook
```
---

## 📄 License

This project is licensed under the Apache License 2.0.
See the LICENSE file for details.

Built with ❤️ using React + Vite + TailwindCSS + Zustand by OD Skyler.
