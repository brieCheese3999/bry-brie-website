import React from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button, Frame } from "@react95/core";

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
    const item = items[currentIndex];

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
    }, [currentIndex, items.length]);

    const isMobile = window.innerWidth <= 768;

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
                    maxWidth: isMobile ? "95vw" : "530px",
                    maxHeight: "90vh",
                    width: "100%",
                }}
            >
                <Modal title={item.label}>
                    <Modal.Content boxShadow="$in" bgColor="white" p="6px">
                        <Frame display="flex" flexDirection="column" alignItems="center" gap="5px">
                            <img
                                src={item.img}
                                alt={item.label}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: isMobile ? "60vh" : "70vh",
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
