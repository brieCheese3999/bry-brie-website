import React from 'react';
import type { GalleryContent } from '../types';
import {Fieldset, Frame, Modal} from "@react95/core";
import { Lightbox } from "./LightBox.tsx";
import { useResponsiveMode } from '../useResponsiveMode';

type GallerySize = 'portrait' | 'portrait-lg' | 'landscape' | 'landscape-lg' | 'landscape-sm';
type Orientation = 'portrait' | 'landscape';

function useImageOrientations(items: { img: any }[]): Orientation[] {
    const [orientations, setOrientations] = React.useState<Orientation[]>([]);

    React.useEffect(() => {
        const promises = items.map((item) =>
            new Promise<Orientation>((resolve) => {
                if (!item.img) { resolve('landscape'); return; }
                const img = new Image();
                img.onload = () => {
                    const ratio = img.naturalWidth / img.naturalHeight;
                    resolve(ratio < 1 ? 'portrait' : 'landscape');
                };
                img.onerror = () => resolve('landscape');
                img.src = item.img;
            })
        );
        Promise.all(promises).then(setOrientations);
    }, [items]);

    return orientations;
}

function getPhotoSize(orientation: Orientation | undefined, index: number): GallerySize {
    if (!orientation) return 'landscape';
    if (orientation === 'portrait') {
        return index % 5 === 0 ? 'portrait-lg' : 'portrait';
    }
    const mod = index % 7;
    if (mod === 0) return 'landscape-lg';
    if (mod === 3 || mod === 5) return 'landscape-sm';
    return 'landscape';
}

export const GalleryPanel: React.FC<{ content: GalleryContent }> = ({ content }) => {
    const { isMobile } = useResponsiveMode();
    const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
    const orientations = useImageOrientations(content.items);
    const [modalIndex, setModalIndex] = React.useState(0);

    React.useEffect(() => {
        if (content.items.length <= 1) return;
        const timer = setInterval(() => {
            setModalIndex((prev) => (prev + 1) % content.items.length);
        }, 60_000);
        return () => clearInterval(timer);
    }, [content.items.length]);

    const lightbox = expandedIndex !== null && (
        <Lightbox
            items={content.items.map((i) => ({ id: i.id, label: i.label, img: i.img }))}
            currentIndex={expandedIndex}
            onClose={() => setExpandedIndex(null)}
            onNavigate={setExpandedIndex}
        />
    );

    return (
        <>
            <div className={isMobile ? "win95-mobile-stack" : ""}>
                <Fieldset
                    legend={content.heading}
                    className={`win95-pixel-heading ${isMobile ? 'win95-mobile-fieldset' : ''}`}
                    style={{ width: isMobile ? undefined : '800px'}}
                >
                    <Frame display="flex" flexDirection="column">
                        <div className="win95-icon-row">
                            <h2 className="win95-subject-name">{content.sectionLabel}</h2>
                            <br/>
                            <p className="win95-bio-text">{content.intro}</p>
                        </div>
                    </Frame>
                </Fieldset>
                {content.items.length > 0 && (
                    <Modal width="26%" height="35%" dragOptions={{ defaultPosition: { x: 870, y: 97 } }}>
                        <Modal.Content style={{ overflow: 'hidden' }}>
                            <img
                                src={content.items[modalIndex].img}
                                alt={content.items[modalIndex].alt}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </Modal.Content>
                    </Modal>
                )}
                <div className="win95-gallery-modal-wrapper">
                            <div className="win95-gallery-wall-scroll">
                                <div className={`win95-gallery-wall ${isMobile ? 'win95-gallery-wall--mobile' : ''}`}>
                                    {content.items.map((item, index) => {
                                        const size = getPhotoSize(orientations[index], index);
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                className={`win95-gallery-wall-item win95-gallery-wall-item--${size} win95-raised`}
                                                onClick={() => setExpandedIndex(index)}
                                                aria-label={`View photo: ${item.label}`}
                                            >
                                                <img src={item.img} alt={item.alt ?? item.label} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                </div>
            </div>
            {lightbox}
        </>
    );
};
