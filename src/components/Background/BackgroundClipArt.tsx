import React, { useState, useEffect, useCallback } from 'react';
import type { ClipArtContent } from "../types.ts";
import { useResponsiveMode } from '../useResponsiveMode.ts';

interface ClipArtProps {
    content: ClipArtContent;
}

export const ClipArt: React.FC<ClipArtProps> = ({ content }) => {
    const [scrollY, setScrollY] = useState(0);
    const { isMobile } = useResponsiveMode();

    const handleScroll = useCallback(() => {
        setScrollY(window.scrollY);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {content.items.map((item) => {
                const speed = item.speed ?? 0.3;
                const offsetY = scrollY * speed;
                const useFixed = item.fixed && !isMobile;

                return (
                    <img
                        key={item.id}
                        src={item.img}
                        alt={item.alt ?? "Photo"}
                        style={{
                            position: useFixed ? 'fixed' : 'absolute',
                            top: item.top,
                            left: item.left,
                            right: item.right,
                            bottom: item.bottom,
                            width: item.width,
                            zIndex: item.zIndex,
                            transform: useFixed ? undefined : `translateY(${offsetY}px)`,
                            willChange: useFixed ? undefined : 'transform',
                            transition: useFixed ? undefined : 'transform 0.1s linear',
                            pointerEvents: 'none',
                        }}
                    />
                );
            })}
        </div>
    );
};
