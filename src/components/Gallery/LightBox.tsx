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
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: isMobile
                        ? "95vw"
                        : isLandscape
                            ? "min(92vw, 1100px)"
                            : "565px",
                    maxHeight: "200vh",
                    width: "100%",
                }}
            >
                <Modal title={item.label}>
                    <Modal.Content boxShadow="$in" bgColor="white" p="6px">
                        <Frame display="flex" flexDirection="column" alignItems="center" gap="5px">
                            <img
                                key={currentIndex}
                                ref={measureOrientation}
                                src={item.img}
                                alt={item.label}
                                onLoad={(e) => measureOrientation(e.currentTarget)}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: isMobile ? "60vh" : "85vh",
                                    objectFit: "contain",
                                }}
                            />
                            <Frame display="flex" flexDirection="row" gap="8px">
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
