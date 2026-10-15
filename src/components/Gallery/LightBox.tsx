import React from 'react';
import { createPortal } from 'react-dom';
import { Modal, TitleBar, Frame } from "@react95/core";
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

    const [imageRatio, setImageRatio] = React.useState(2 / 3);
    const measureOrientation = React.useCallback((img: HTMLImageElement | null) => {
        if (img && img.naturalWidth > 0) {
            setImageRatio(img.naturalWidth / img.naturalHeight);
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
                .lightbox-wrapper [role="dialog"] > .draggable {
                    height: calc(var(--r95-space-20) * 1.5);
                    align-items: center;
                }
                .lightbox-wrapper .draggable > div:first-child {
                    min-width: 0;
                    flex-shrink: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .lightbox-wrapper button[aria-label="Close photo"] {
                    width: 26px;
                    height: 22px;
                }
                .lightbox-wrapper button[aria-label="Close photo"] img {
                    width: 12px;
                    height: 12px;
                    image-rendering: pixelated;
                }
                .lightbox-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 56px;
                    padding: 8px;
                    border: 0;
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    display: grid;
                    place-items: center;
                }
                .lightbox-arrow--prev { left: 8px; }
                .lightbox-arrow--next { right: 8px; }
                .lightbox-arrow:hover { color: #ffff80; }
                .lightbox-arrow:focus-visible { outline: 2px dashed white; outline-offset: 2px; }
                .lightbox-arrow svg { width: 28px; height: 36px; filter: drop-shadow(2px 2px 0 #000); }
                @media (max-width: 600px) {
                    .lightbox-arrow--prev { left: 0; }
                    .lightbox-arrow--next { right: 0; }
                    .lightbox-arrow { width: 40px; }
                }
            `}</style>
            <div
                className="lightbox-wrapper"
                ref={wrapperRef}
                style={{
                    // Limit the photo by both viewport dimensions, then fit the
                    // window to that width instead of leaving empty side panels.
                    width: `min(${isMobile ? "calc(100vw - 96px)" : "min(calc(100vw - 120px), 1100px)"}, calc(${isMobile ? "60dvh" : "min(85dvh, calc(100dvh - 80px))"} * ${imageRatio} + 8px))`,
                    position: "relative",
                    transform: entered ? "scale(1)" : "scale(0.94)",
                    transition: "transform 200ms ease",
                }}
            >
                <button className="lightbox-arrow lightbox-arrow--prev" style={{ left: isMobile ? -40 : -52 }} type="button" aria-label="Previous photo" title="Previous photo" onClick={goPrev}>
                    <svg viewBox="0 0 7 9" aria-hidden="true" shapeRendering="crispEdges"><path fill="currentColor" d="M4 0h3v1H6v1H5v1H4v1H3v1h1v1h1v1h1v1h1v1H4V8H3V7H2V6H1V5H0V4h1V3h1V2h1V1h1z" /></svg>
                </button>
                <button className="lightbox-arrow lightbox-arrow--next" style={{ right: isMobile ? -40 : -52 }} type="button" aria-label="Next photo" title="Next photo" onClick={goNext}>
                    <svg viewBox="0 0 7 9" aria-hidden="true" shapeRendering="crispEdges"><g transform="translate(7 0) scale(-1 1)"><path fill="currentColor" d="M4 0h3v1H6v1H5v1H4v1H3v1h1v1h1v1h1v1h1v1H4V8H3V7H2V6H1V5H0V4h1V3h1V2h1V1h1z" /></g></svg>
                </button>
                <Modal
                    title={item.label}
                    aria-label={item.label}
                    aria-modal="true"
                    titleBarOptions={<TitleBar.Close ref={closeRef} aria-label="Close photo" title="Close photo" onClick={onClose} />}
                >
                    <Modal.Content boxShadow="$in" bgColor="white" style={{ padding: "2px", margin: 0 }}>
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
                                    display: "block",
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                    opacity: imgLoaded ? 1 : 0,
                                    transition: "opacity 180ms ease",
                                }}
                            />
                        </Frame>
                    </Modal.Content>
                </Modal>
            </div>
        </div>,
        document.body
    );
};
