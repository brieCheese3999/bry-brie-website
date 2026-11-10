import React from 'react';
import type { GalleryContent } from '../types';
import {Fieldset, Frame, Modal} from "@react95/core";
import Masonry from "./Masonry.tsx";
import { useResponsiveMode } from '../useResponsiveMode';

export const GalleryPanel: React.FC<{ content: GalleryContent }> = ({ content }) => {
    const { isMobile } = useResponsiveMode();
    const [modalIndex, setModalIndex] = React.useState(0);

    React.useEffect(() => {
        if (isMobile || content.items.length <= 1) return;
        const timer = setInterval(() => {
            setModalIndex((prev) => (prev + 1) % content.items.length);
        }, 30_000);
        return () => clearInterval(timer);
    }, [content.items.length, isMobile]);

    // Tiles show the thumbnails; the masonry's own lightbox opens the full photo.
    const photos = content.items.map((item) => ({
        id: item.id,
        img: item.img,
        thumbnail: item.thumbnail,
        srcSet: item.srcSet,
        width: item.width,
        height: item.height,
        // a caption that wraps keeps "· 2026" with the place before it
        title: item.label.replace(' · ', ' · '),
        alt: item.alt ?? item.label,
    }));

    return (
        <div className={`win95-typewriter win95-photos${isMobile ? " win95-mobile-stack" : ""}`}>
            <Fieldset
                legend={content.heading}
                className={`win95-pixel-heading ${isMobile ? 'win95-mobile-fieldset' : ''}`}
                style={{ width: isMobile ? undefined : '800px'}}
            >
                <Frame display="flex" flexDirection="column">
                    <div className="win95-icon-row">
                        <span className="flex-break" />
                        {(() => {
                            const parts = content.intro.split('\n\n');
                            const paragraph = parts[0];
                            const destinations = parts[1]?.split('\n').filter(Boolean) ?? [];
                            return (
                                <>
                                    <p className="win95-bio-text">{paragraph}</p>
                                    {destinations.length > 0 && (
                                        <ul className="win95-destination-list">
                                            {destinations.map((d) => (
                                                <li key={d}>{d}</li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </Frame>
            </Fieldset>
            {!isMobile && content.items.length > 0 && (
                <Modal width="30%" height="39%" dragOptions={{ defaultPosition: { x: 870, y: 0 } }}  title={"PHOTOS"}>
                    <Modal.Content style={{ overflow: 'hidden' }}>
                        <img
                            src={content.items[modalIndex].thumbnail ?? content.items[modalIndex].img}
                            srcSet={content.items[modalIndex].srcSet}
                            sizes="(max-width: 1279px) 30vw, 480px"
                            alt={content.items[modalIndex].alt}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </Modal.Content>
                </Modal>
            )}
            <div className="win95-gallery-modal-wrapper">
                <Masonry
                    className="win95-gallery-masonry"
                    items={photos}
                    columns={isMobile ? 2 : 4}
                    gap={isMobile ? 14 : 10}
                />
            </div>
        </div>
    );
};
