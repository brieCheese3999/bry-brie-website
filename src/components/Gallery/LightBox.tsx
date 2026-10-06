import React from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button, Frame } from "@react95/core";
import { useResponsiveMode } from '../useResponsiveMode';

interface LightboxItem {
    id: string;
    label: string;
    img: string;
}

interface LightboxProps {
    items: LightboxItem[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ items, currentIndex, onClose, onNavigate }) => {
    const { isMobile } = useResponsiveMode();
    const item = items[currentIndex];

    const [isLandscape, setIsLandscape] = React.useState(false);
    const measureOrientation = React.useCallback((img: HTMLImageElement | null) => {
        if (img && img.naturalWidth > 0) {
            setIsLandscape(img.naturalWidth > img.naturalHeight);
        }
    }, []);

    // The <img> keeps loading (and painting a flash of nothing) every time
    // currentIndex changes. Fade it out immediately on navigation and back
    // in once the new source has actually loaded, so switching photos reads
    // as a crossfade instead of a blocky pop.
    const [imgLoaded, setImgLoaded] = React.useState(false);
    React.useEffect(() => {
        setImgLoaded(false);
    }, [currentIndex]);

    // Mount the overlay transparent/scaled-down, then flip to its resting
    // state one frame later so the open itself animates in instead of
    // snapping into place.
    const [entered, setEntered] = React.useState(false);
    React.useEffect(() => {
        const frame = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const goPrev = () => onNavigate((currentIndex - 1 + items.length) % items.length);
    const goNext = () => onNavigate((currentIndex + 1) % items.length);

    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
        // goPrev/goNext/onClose are stable within a render; re-bind when the
        // index or list length changes so the handlers don't capture stale values.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, items.length]);

    return createPortal(
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                opacity: entered ? 1 : 0,
                transition: "opacity 200ms ease",
            }}
            onClick={onClose}
        >
            <style>{`
                .lightbox-wrapper [role="dialog"] {
                    position: relative !important;
                    top: auto !important;
                    left: auto !important;
                    margin: 0 auto;
                }
            `}</style>
            <div
                className="lightbox-wrapper"
                style={{
                    maxWidth: isMobile
                        ? "77vw"
                        : isLandscape
                            ? "min(92vw, 1100px)"
                            : "565px",
                    maxHeight: "200vh",
                    width: "100%",
                    transform: entered ? "scale(1)" : "scale(0.94)",
                    transition: "transform 200ms ease",
                }}
            >
                <Modal title={item.label}>
                    <Modal.Content boxShadow="$in" bgColor="white">
                        <Frame display="flex" flexDirection="column" alignItems="center" gap="5px">
                            <img
                                ref={measureOrientation}
                                src={item.img}
                                alt={item.label}
                                onLoad={(e) => {
                                    measureOrientation(e.currentTarget);
                                    setImgLoaded(true);
                                }}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: isMobile ? "60vh" : "85vh",
                                    objectFit: "contain",
                                    opacity: imgLoaded ? 1 : 0,
                                    transition: "opacity 180ms ease",
                                }}
                            />
                            <Frame display="flex" flexDirection="row" gap="8px" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <Button onClick={goPrev}>&lt; Prev</Button>
                                <Button onClick={onClose}>Close</Button>
                                <Button onClick={goNext}>Next &gt;</Button>
                            </Frame>
                        </Frame>
                    </Modal.Content>
                </Modal>
            </div>
        </div>,
        document.body
    );
};
