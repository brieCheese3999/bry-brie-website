import React from 'react';
import type { GalleryContent } from '../types';
import {Fieldset, Frame, Modal} from "@react95/core";
import { Lightbox } from "./LightBox.tsx";
import { useResponsiveMode } from '../useResponsiveMode';

export const GalleryPanel: React.FC<{ content: GalleryContent }> = ({ content }) => {
    const { isMobile } = useResponsiveMode();
    const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
    const [modalIndex, setModalIndex] = React.useState(0);

    React.useEffect(() => {
        if (content.items.length <= 1) return;
        const timer = setInterval(() => {
            setModalIndex((prev) => (prev + 1) % content.items.length);
        }, 30_000);
        return () => clearInterval(timer);
    }, [content.items.length]);

    const columns = isMobile ? 2 : 4;
    const rows = Array.from({ length: Math.ceil(content.items.length / columns) }, (_, row) =>
        content.items.slice(row * columns, (row + 1) * columns)
    );

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
            <div className={isMobile ? "win95-mobile-stack" : ""} style={{paddingTop: '15px'}}>
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
                            <div className="win95-gallery-wall-scroll">
                                <div className={`win95-gallery-wall ${isMobile ? 'win95-gallery-wall--mobile' : ''}`}>
                                    {rows.map((row, rowIndex) => (
                                    <div className="win95-gallery-row" key={row[0].id}>
                                    {row.map((item, columnIndex) => {
                                        const index = rowIndex * columns + columnIndex;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                className="win95-gallery-wall-item win95-raised"
                                                style={{ flex: `${item.width && item.height ? item.width / item.height : 1} 1 0%` }}
                                                onClick={event => {
                                                    event.currentTarget.focus({ preventScroll: true });
                                                    setExpandedIndex(index);
                                                }}
                                                aria-label={`View photo: ${item.label}`}
                                            >
                                                <img
                                                    src={item.thumbnail ?? item.img}
                                                    srcSet={item.srcSet}
                                                    sizes="(max-width: 1279px) calc((100vw - 120px) / 2), 340px"
                                                    alt={item.alt ?? item.label}
                                                    loading="lazy"
                                                    decoding="async"
                                                    style={{ aspectRatio: item.width && item.height ? `${item.width} / ${item.height}` : undefined, objectFit: 'cover' }}
                                                    width={item.width}
                                                    height={item.height}
                                                />
                                            </button>
                                        );
                                    })}
                                    </div>
                                    ))}
                                </div>
                            </div>
                </div>
            </div>
            {lightbox}
        </>
    );
};
