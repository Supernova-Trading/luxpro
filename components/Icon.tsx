"use client";

import type { SVGProps } from 'react';

export type IconName =
  | 'arrow-left'
  | 'arrow-up'
  | 'attach'
  | 'bank'
  | 'bluetooth'
  | 'candy'
  | 'car'
  | 'cash'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'cookie'
  | 'copy'
  | 'comment'
  | 'dice'
  | 'download'
  | 'draw'
  | 'droplet'
  | 'edit'
  | 'eye'
  | 'file'
  | 'file-code'
  | 'flame'
  | 'folder'
  | 'gamepad'
  | 'grid'
  | 'hand'
  | 'headphones'
  | 'help-circle'
  | 'history'
  | 'image'
  | 'import'
  | 'kanban'
  | 'languages'
  | 'lightbulb'
  | 'link'
  | 'map-pin'
  | 'mic'
  | 'minus'
  | 'moon'
  | 'music-note'
  | 'pause'
  | 'pencil'
  | 'phone'
  | 'plug'
  | 'plus'
  | 'play'
  | 'present'
  | 'radio'
  | 'refresh'
  | 'reload'
  | 'road'
  | 'search'
  | 'send'
  | 'settings'
  | 'share'
  | 'skip-back'
  | 'skip-forward'
  | 'sliders'
  | 'smile'
  | 'snowflake'
  | 'tic-tac-toe'
  | 'spinner'
  | 'sparkles'
  | 'stop'
  | 'sun'
  | 'trash'
  | 'tweaks'
  | 'upload'
  | 'zap'
  | 'zoom-in'
  | 'zoom-out';

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number | string;
}

export function Icon({ name, size = 14, strokeWidth = 1.6, ...rest }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: 'false' as const,
    ...rest,
  };
  switch (name) {
    case 'arrow-left':
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );
    case 'arrow-up':
      return (
        <svg {...common}>
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      );
    case 'attach':
      return (
        <svg {...common}>
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg {...common}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case 'copy':
      return (
        <svg {...common}>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case 'comment':
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'download':
      return (
        <svg {...common}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
      );
    case 'draw':
      return (
        <svg {...common}>
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
          <path d="m14.06 6.19 3.75 3.75" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...common}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'file':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case 'file-code':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="m10 13-2 2 2 2" />
          <path d="m14 17 2-2-2-2" />
        </svg>
      );
    case 'folder':
      return (
        <svg {...common}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'history':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'image':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-4.5-4.5L7 20" />
        </svg>
      );
    case 'import':
      return (
        <svg {...common}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m17 8-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
      );
    case 'kanban':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="5" height="16" rx="1" />
          <rect x="10" y="4" width="5" height="10" rx="1" />
          <rect x="17" y="4" width="4" height="13" rx="1" />
        </svg>
      );
    case 'languages':
      return (
        <svg {...common}>
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      );
    case 'link':
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 1 0-7.07-7.07L11.75 5.18" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 1 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 'mic':
      return (
        <svg {...common}>
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <path d="M12 18v3" />
        </svg>
      );
    case 'minus':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'pencil':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...common}>
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common}>
          <path d="M6 4v16l14-8z" />
        </svg>
      );
    case 'present':
      return (
        <svg {...common}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 0 1 15.9-5.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15.9 5.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      );
    case 'reload':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 4v5h-5" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'send':
      return (
        <svg {...common}>
          <path d="M22 2 11 13" />
          <path d="m22 2-7 20-4-9-9-4z" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.82 2.83l-.06-.07a1.7 1.7 0 0 0-1.88-.33 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.82l.07-.06a1.7 1.7 0 0 0 .33-1.88 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.07A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.07.06a1.7 1.7 0 0 0-.33 1.87V9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.56 1.04Z" />
        </svg>
      );
    case 'share':
      return (
        <svg {...common}>
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
          <path d="m16 6-4-4-4 4" />
          <path d="M12 2v13" />
        </svg>
      );
    case 'sliders':
      return (
        <svg {...common}>
          <path d="M4 21v-7" />
          <path d="M4 10V3" />
          <path d="M12 21v-9" />
          <path d="M12 8V3" />
          <path d="M20 21v-5" />
          <path d="M20 12V3" />
          <path d="M1 14h6" />
          <path d="M9 8h6" />
          <path d="M17 16h6" />
        </svg>
      );
    case 'spinner':
      return (
        <svg {...common} className={`icon-spin ${rest.className ?? ''}`.trim()}>
          <path d="M21 12a9 9 0 1 1-6.22-8.56" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...common}>
          <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
          <path d="M19 14v3" />
          <path d="M19 21v-1" />
          <path d="M22 17h-3" />
          <path d="M16 17h-1" />
        </svg>
      );
    case 'stop':
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="1.5" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case 'tweaks':
      return (
        <svg {...common}>
          <path d="M4 6h13" />
          <circle cx="19" cy="6" r="2" />
          <path d="M4 18h7" />
          <circle cx="13" cy="18" r="2" />
          <path d="M17 12H4" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...common}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m17 8-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
      );
    case 'zoom-in':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M11 8v6" />
          <path d="M8 11h6" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'zoom-out':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M8 11h6" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    // ── Passenger-dashboard icons (replacing emoji chrome) ──────────────────
    case 'bank':
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V10" />
          <path d="M9 21V10" />
          <path d="M15 21V10" />
          <path d="M19 21V10" />
          <path d="M2 10 12 3l10 7" />
        </svg>
      );
    case 'bluetooth':
      return (
        <svg {...common}>
          <path d="M6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
        </svg>
      );
    case 'candy':
      return (
        <svg {...common}>
          <path d="M12 12 4 7v10z" />
          <path d="M12 12 20 7v10z" />
        </svg>
      );
    case 'car':
      return (
        <svg {...common}>
          <path d="M5 11 7 7h10l2 4" />
          <rect x="3" y="11" width="18" height="6" rx="2" />
          <circle cx="7.5" cy="17.5" r="1.3" />
          <circle cx="16.5" cy="17.5" r="1.3" />
        </svg>
      );
    case 'cash':
      return (
        <svg {...common}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01" />
          <path d="M18 12h.01" />
        </svg>
      );
    case 'cookie':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="9" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="15" cy="14.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="15" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'dice':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8" cy="8" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="16" cy="8" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="8" cy="16" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="16" cy="16" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'droplet':
      return (
        <svg {...common}>
          <path d="M12 2.7s-5 5.6-5 9.5a5 5 0 0 0 10 0c0-3.9-5-9.5-5-9.5z" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 2c1.8 3.5-.8 4.8-.8 7.2a2.8 2.8 0 1 0 5.6 0c1.4 1.3 2.2 3 2.2 5a7 7 0 1 1-14 0c0-4.5 3-6.5 7-12.2z" />
        </svg>
      );
    case 'gamepad':
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="10" rx="5" />
          <path d="M7 10v4" />
          <path d="M5 12h4" />
          <circle cx="15" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="18" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'hand':
      return (
        <svg {...common}>
          <path d="M8 13V5a1.5 1.5 0 0 1 3 0v6" />
          <path d="M11 11V3.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M14 10.5V4.5a1.5 1.5 0 0 1 3 0V13" />
          <path d="M8 12.5 6.5 11a1.5 1.5 0 0 0-2.3 1.9L7 18a6 6 0 0 0 5.5 3.5h1A6.5 6.5 0 0 0 20 15v-2.5a1.5 1.5 0 0 0-3 0" />
        </svg>
      );
    case 'headphones':
      return (
        <svg {...common}>
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      );
    case 'help-circle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'lightbulb':
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
        </svg>
      );
    case 'map-pin':
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'music-note':
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...common}>
          <path d="M9 2v4" />
          <path d="M15 2v4" />
          <path d="M7 8h10l-.5 6a4.5 4.5 0 0 1-9 0z" />
          <path d="M12 18v4" />
        </svg>
      );
    case 'radio':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <path d="M16.2 7.8a6 6 0 0 1 0 8.4" />
          <path d="M7.8 7.8a6 6 0 0 0 0 8.4" />
          <path d="M19.1 4.9a10 10 0 0 1 0 14.2" />
          <path d="M4.9 4.9a10 10 0 0 0 0 14.2" />
        </svg>
      );
    case 'road':
      return (
        <svg {...common}>
          <path d="M9 20 10.5 4h3L15 20" />
          <path d="M12 7v2.5" />
          <path d="M12 13v2.5" />
        </svg>
      );
    case 'skip-back':
      return (
        <svg {...common}>
          <path d="M19 20 9 12l10-8z" />
          <path d="M5 19V5" />
        </svg>
      );
    case 'skip-forward':
      return (
        <svg {...common}>
          <path d="M5 4 15 12 5 20z" />
          <path d="M19 5v14" />
        </svg>
      );
    case 'smile':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <path d="M9 9h.01" />
          <path d="M15 9h.01" />
        </svg>
      );
    case 'snowflake':
      return (
        <svg {...common}>
          <path d="M12 2v20" />
          <path d="M4.2 7l15.6 10" />
          <path d="M19.8 7 4.2 17" />
        </svg>
      );
    case 'tic-tac-toe':
      return (
        <svg {...common}>
          <path d="M9 3v18" />
          <path d="M15 3v18" />
          <path d="M3 9h18" />
          <path d="M3 15h18" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...common}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    default:
      return null;
  }
}
