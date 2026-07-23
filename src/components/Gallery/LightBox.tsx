// Lightbox.tsx
import React from 'react';
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

    const modalWidth = 530; // matches your Modal's width="500px"
    const modalHeight = 700; // estimate/measure your content height

    const centeredPosition = {
        x: window.innerWidth / 2 - modalWidth / 2,
        y: window.innerHeight / 2 - modalHeight / 2,
    };
    // optional: arrow-key navigation, escape to close
    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [currentIndex, items.length]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={onClose} // click the dimmed backdrop to close
        >
            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    title={item.label}
                    minWidth="530px"
                    minHeight="700px"
                    dragOptions={{ defaultPosition: {x: centeredPosition.x, y: centeredPosition.y} }}
                >
                    <Modal.Content boxShadow="$in" bgColor="white" p="6px">
                        <Frame display="flex" flexDirection="column" alignItems="center" gap="5px">
                            <img src={item.img} alt={item.label} style={{ maxWidth: "100%", maxHeight: "80vh" }} />
                            <Frame display="flex" flexDirection="row" gap="8px">
                                <Button onClick={goPrev}>&lt; Prev</Button>
                                <Button onClick={onClose}>Close</Button>
                                <Button onClick={goNext}>Next &gt;</Button>
                            </Frame>
                        </Frame>
                    </Modal.Content>
                </Modal>
            </div>
        </div>
    );
};