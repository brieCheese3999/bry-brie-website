import { useEffect, useState } from 'react';

/**
 * The desktop layout is built from fixed pixel widths and fixed pixel
 * dragOptions coordinates (it's meant to look like a real Windows 95 desktop),
 * so it can't reflow on its own the way a normal responsive page would.
 *
 * Instead, we render it at a fixed "design canvas" size and scale the whole
 * canvas to fit the current window width — the same idea as scaling an image.
 * Everything inside (text, icons, floating windows) scales together,
 * preserving the exact relative arrangement of every window.
 *
 * Only used in desktop/tablet mode — see useResponsiveMode.ts for the
 * breakpoint below which we switch to a non-scaled stacked layout instead.
 */
export function useResponsiveScale(designWidth: number): number {
  const [scale, setScale] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth / designWidth : 1
  );

  useEffect(() => {
    const updateScale = () => setScale(window.innerWidth / designWidth);

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [designWidth]);

  return scale;
}
