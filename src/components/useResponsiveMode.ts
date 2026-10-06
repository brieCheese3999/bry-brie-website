import { useCallback, useSyncExternalStore } from 'react';

/**
 * Below this width, the site switches from the "Windows 95 desktop" experience
 * (floating, draggable windows positioned at fixed pixel coordinates, scaled
 * to fit via useResponsiveScale) to a simplified single-column layout.
 *
 * Floating/draggable windows don't work well on phone and tablet touch screens — there's
 * no room to drag things around, and overlapping tiny windows are hard to read
 * or tap accurately. Below this breakpoint, every panel renders its content as
 * a stacked, static section instead.
 *
 * This is the single source of truth for the breakpoint — the matching media
 * query in win95Portfolio.css is kept in sync with this value manually (CSS
 * can't import a JS constant without a build-time step), search that file for
 * MOBILE_BREAKPOINT_PX if you change this number.
 */
export const MOBILE_BREAKPOINT_PX = 1279;

export interface ResponsiveMode {
  isMobile: boolean;
  isDesktop: boolean;
}

export function useResponsiveMode(): ResponsiveMode {
  const query = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`;

  // Subscribe to the media query via useSyncExternalStore — the idiomatic way
  // to read from an external source like matchMedia. React re-renders whenever
  // the match state flips, with no effect/setState round-trip.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const isMobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches, // client snapshot
    () => false // server snapshot (no window)
  );

  return { isMobile, isDesktop: !isMobile };
}
