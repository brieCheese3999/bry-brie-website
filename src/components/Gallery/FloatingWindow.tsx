import React, { useRef, useState, useCallback, useEffect } from 'react';
import { TitleBar } from './TitleBar.tsx';
import type { WindowPosition } from '../types.ts';

export interface FloatingWindowProps {
  title: string;
  /** Anchor position before the user first drags the window (e.g. { top: 40, right: 30 }). */
  initialAnchor: { top: number; right: number };
  width: number;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const FloatingWindow: React.FC<FloatingWindowProps> = ({
  title,
  initialAnchor,
  width,
  visible,
  onClose,
  children,
  containerRef,
}) => {
  // null = still anchored via initialAnchor (top/right); set once the user drags.
  const [position, setPosition] = useState<WindowPosition | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ dragging: boolean; offsetX: number; offsetY: number }>({
    dragging: false,
    offsetX: 0,
    offsetY: 0,
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!windowRef.current || !containerRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const parentRect = containerRef.current.getBoundingClientRect();
    // Lock in a concrete left/top the first time the window is dragged,
    // so it doesn't jump when switching off the top/right anchor.
    if (position === null) {
      setPosition({ x: rect.left - parentRect.left, y: rect.top - parentRect.top });
    }
    dragState.current = {
      dragging: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
  }, [containerRef, position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.dragging || !windowRef.current || !containerRef.current) return;
      const parentRect = containerRef.current.getBoundingClientRect();
      const winEl = windowRef.current;
      let x = e.clientX - parentRect.left - dragState.current.offsetX;
      let y = e.clientY - parentRect.top - dragState.current.offsetY;
      x = Math.max(0, Math.min(x, parentRect.width - winEl.offsetWidth));
      y = Math.max(0, Math.min(y, parentRect.height - winEl.offsetHeight));
      setPosition({ x, y });
    };
    const handleMouseUp = () => {
      dragState.current.dragging = false;
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef]);

  if (!visible) return null;

  const positionStyle: React.CSSProperties =
    position === null
      ? { top: initialAnchor.top, right: initialAnchor.right }
      : { left: position.x, top: position.y };

  return (
    <div
      ref={windowRef}
      className="win95-float-window"
      style={{ width, ...positionStyle }}
    >
      <div onMouseDown={handleMouseDown}>
        <TitleBar title={title} onClose={onClose} />
      </div>
      <div className="win95-win-body">{children}</div>
    </div>
  );
};
