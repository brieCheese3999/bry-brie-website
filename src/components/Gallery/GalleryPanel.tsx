import React from 'react';
import type { GalleryContent } from '../types';
import {Fieldset, Frame} from "@react95/core";
import {PhotoModal} from "./PhotoModal.tsx";
import {generateCascadePositions} from "./cascadePositions.ts";
import {Lightbox} from "./LightBox.tsx";
import { useResponsiveMode } from '../useResponsiveMode';

interface GalleryContentPanelProps {
    content: GalleryContent;
    expandedIndex: number | null;
    onExpand: (index: number) => void;
}

/**
 * Desktop/tablet rendering: photos cascade as floating, draggable windows at
 * fixed pixel coordinates, scaled to fit the viewport by the parent
 * (Win95Portfolio) via useResponsiveScale — left entirely as-is here.
 */
const DesktopGalleryPanel: React.FC<GalleryContentPanelProps> = ({ content, onExpand }) => {
    const positions = React.useMemo(
        () =>
            generateCascadePositions(content.items.length, {
                columnStarts: [
                    { x: 800, y: -10 },
                    { x: 1170, y: -10 },
                ],
                stepX: -50,
                stepY: 80,
            }),
        [content.items.length]
    );

    return (
        <div style={{ position: 'relative'}}>
            <Frame>
                <Fieldset width="800px" legend={content.heading} className="win95-pixel-heading" style={{
                    marginBottom: '1em'
                }}>
                    <Frame display="flex" flexDirection="column">
                        <div className="win95-icon-row">
                            <h2 className="win95-subject-name">Photos</h2>
                            <p className="win95-bio-text">hi</p>
                        </div>
                    </Frame>
                </Fieldset>
            </Frame>
            <div>
                {content.items.map((item, index) => (
                    <PhotoModal
                        key={item.id}
                        id={item.id}
                        title={item.label}
                        image={item.img}
                        dragOptions={{ defaultPosition: positions[index] }}
                        onExpand={() => onExpand(index)}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * Mobile rendering: a plain tap-to-expand photo grid (no dragging, no fixed
 * coordinates) using the existing .win95-gallery-grid / .win95-gallery-tile
 * classes from win95Portfolio.css. Tapping a tile opens the same Lightbox
 * used on desktop.
 */
const MobileGalleryPanel: React.FC<GalleryContentPanelProps> = ({ content, onExpand }) => (
    <div className="win95-mobile-stack">
        <Fieldset legend={content.heading} className="win95-pixel-heading win95-mobile-fieldset">
            <h2 className="win95-subject-name">Photos</h2>
        </Fieldset>
        <div className="win95-gallery-grid win95-mobile-gallery-grid">
            {content.items.map((item, index) => (
                <button
                    key={item.id}
                    type="button"
                    className="win95-gallery-tile win95-raised"
                    onClick={() => onExpand(index)}
                    aria-label={`View photo: ${item.label}`}
                >
                    <img src={item.img} alt={item.label} />
                </button>
            ))}
        </div>
    </div>
);

export const GalleryPanel: React.FC<{ content: GalleryContent }> = ({ content }) => {
    const { isMobile } = useResponsiveMode();
    const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

    const lightbox = expandedIndex !== null && (
        <Lightbox
            items={content.items.map((i) => ({ id: i.id, label: i.label, img: i.img }))}
            currentIndex={expandedIndex}
            onClose={() => setExpandedIndex(null)}
            onNavigate={setExpandedIndex}
        />
    );

    const Panel = isMobile ? MobileGalleryPanel : DesktopGalleryPanel;

    return (
        <>
            <Panel content={content} expandedIndex={expandedIndex} onExpand={setExpandedIndex} />
            {lightbox}
        </>
    );
};
