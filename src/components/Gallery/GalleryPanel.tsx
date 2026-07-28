import React from 'react';
import type { GalleryContent } from '../types';
import {Fieldset, Frame, Modal} from "@react95/core";
import { Lightbox } from "./LightBox.tsx";
import { useResponsiveMode } from '../useResponsiveMode';

type GallerySize = 'portrait' | 'portrait-lg' | 'landscape' | 'landscape-lg' | 'landscape-sm';
type Orientation = 'portrait' | 'landscape';

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
    // Orientation is measured from each image as it actually loads (lazily),
    // rather than eagerly downloading all images up front just to measure them.
    const [orientations, setOrientations] = React.useState<Record<number, Orientation>>({});
    const [modalIndex, setModalIndex] = React.useState(0);

    const handleImgLoad = (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
        const el = e.currentTarget;
        const orientation: Orientation = el.naturalWidth < el.naturalHeight ? 'portrait' : 'landscape';
        setOrientations((prev) => (prev[index] ? prev : { ...prev, [index]: orientation }));
    };

    React.useEffect(() => {
        if (content.items.length <= 1) return;
        const timer = setInterval(() => {
            setModalIndex((prev) => (prev + 1) % content.items.length);
        }, 30_000);
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
                            <span className="flex-break" />
                            <p className="win95-bio-text">{content.intro}</p>
                        </div>
                    </Frame>
                </Fieldset>
                {content.items.length > 0 && (
                    <Modal width="30%" height="40%" dragOptions={{ defaultPosition: { x: 870, y: 0 } }}  title={"PHOTOS"}>
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
                                                <img
                                                    src={item.img}
                                                    alt={item.alt ?? item.label}
                                                    loading="lazy"
                                                    decoding="async"
                                                    onLoad={(e) => handleImgLoad(index, e)}
                                                />
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
