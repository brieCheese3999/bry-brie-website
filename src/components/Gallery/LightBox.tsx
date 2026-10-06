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
    const [loadedImage, setLoadedImage] = React.useState<string | null>(null);
    const imgLoaded = loadedImage === item.img;
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const closeRef = React.useRef<HTMLButtonElement>(null);

    React.useLayoutEffect(() => {
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const bodyStyle = document.body.style.cssText;
        const htmlOverflow = document.documentElement.style.overflow;
        const backdrop = wrapperRef.current?.parentElement;
        const background = Array.from(document.body.children)
            .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== backdrop)
            .map(element => ({ element, inert: element.inert, ariaHidden: element.getAttribute('aria-hidden') }));

        // Move focus before hiding its previous container from assistive technology.
        closeRef.current?.focus({ preventScroll: true });
        background.forEach(({ element }) => {
            element.inert = true;
            element.setAttribute('aria-hidden', 'true');
        });
        // Fixed positioning also prevents viewport scrolling on touch browsers.
        document.documentElement.style.overflow = 'hidden';
        Object.assign(document.body.style, {
            position: 'fixed', top: `${-scrollY}px`, left: `${-scrollX}px`,
            width: '100%', overflow: 'hidden',
        });
        const containFocus = (event: FocusEvent) => {
            if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
                closeRef.current?.focus();
            }
        };
        const trapTab = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;
            const buttons = Array.from(wrapperRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        document.addEventListener('focusin', containFocus);
        document.addEventListener('keydown', trapTab);
        return () => {
            document.removeEventListener('focusin', containFocus);
            document.removeEventListener('keydown', trapTab);
            background.forEach(({ element, inert, ariaHidden }) => {
                element.inert = inert;
                if (ariaHidden === null) element.removeAttribute('aria-hidden');
                else element.setAttribute('aria-hidden', ariaHidden);
            });
            document.body.style.cssText = bodyStyle;
            document.documentElement.style.overflow = htmlOverflow;
            window.scrollTo(scrollX, scrollY);
            if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        };
    }, []);

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
            data-testid="lightbox-backdrop"
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
            onClick={event => { if (event.target === event.currentTarget) onClose(); }}
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
                ref={wrapperRef}
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
                <Modal title={item.label} aria-label={item.label} aria-modal="true">
                    <Modal.Content boxShadow="$in" bgColor="white">
                        <Frame display="flex" flexDirection="column" alignItems="center" gap="5px">
                            <img
                                ref={measureOrientation}
                                src={item.img}
                                alt={item.label}
                                onLoad={(e) => {
                                    measureOrientation(e.currentTarget);
                                    setLoadedImage(item.img);
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
                                <Button ref={closeRef} onClick={onClose}>Close</Button>
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
