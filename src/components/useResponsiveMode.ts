import { useEffect, useState } from 'react';

/**
 * Below this width, the site switches from the "Windows 95 desktop" experience
 * (floating, draggable windows positioned at fixed pixel coordinates, scaled
 * to fit via useResponsiveScale) to a simplified single-column layout.
 *
 * Floating/draggable windows don't work well on narrow touch screens — there's
 * no room to drag things around, and overlapping tiny windows are hard to read
 * or tap accurately. Below this breakpoint, every panel renders its content as
 * a stacked, static section instead.
 *
 * This is the single source of truth for the breakpoint — the matching media
 * query in win95Portfolio.css is kept in sync with this value manually (CSS
 * can't import a JS constant without a build-time step), search that file for
 * MOBILE_BREAKPOINT_PX if you change this number.
 */
export const MOBILE_BREAKPOINT_PX = 768;

export interface ResponsiveMode {
  isMobile: boolean;
  isDesktop: boolean;
}

export function useResponsiveMode(): ResponsiveMode {
  const query = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`;

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    // Sync immediately in case the viewport changed between initial render and mount
    setIsMobile(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return { isMobile, isDesktop: !isMobile };
}
