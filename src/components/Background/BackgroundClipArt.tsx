// src/components/BackgroundClipArt.tsx
import React from 'react';
import type {ClipArtContent} from "../types.ts";


interface ClipArtProps {
    content: ClipArtContent;
}

export const ClipArt: React.FC<ClipArtProps> = ({ content}) => {
    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {content.items.map((item) => (
                <img
                    key={item.id}
                    src={item.img}
                    alt={item.alt ?? "Photo"}
                    style={{
                        position: 'absolute',
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        bottom: item.bottom,
                        width: item.width,
                        zIndex: item.zIndex,
                    }}
                />
            ))}
        </div>
    );
};

