import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@react95/core';
import styled, { css } from 'styled-components';
import { FoggedGlass } from '../Background/FoggedGlass.tsx';
import { loadPortfolio, portfolioReady } from './loadPortfolio.ts';
import photo1 from '../../assets/photos/HAWAII15.jpeg';
import photo2 from '../../assets/photos/HAWAII_4.jpg';
import roseAtelier from '../../assets/fonts/the-rose-atelier-bold.woff2';

// If the name somehow never finishes (a photo fails to load, say), don't keep
// the door shut: open it this long after the portfolio is ready.
const ENTER_ANYWAY_MS = 12_000;

const Page = styled.main`
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: grid;
  /* Enter sits low; the name is lettered large in the space above it */
  justify-items: center;
  align-items: end;
  box-sizing: border-box;
  padding: 48px 24px clamp(20px, 6svh, 72px);
  /* the mist's own tones, so the page is already fogged before the photos arrive */
  background: linear-gradient(180deg, #8f9496 0%, #a3a5a1 46%, #6e716b 72%, #4c4f4a 100%);
  font-family: 'MS Sans Serif', sans-serif;
  /* A thin plus for wiping the glass; one-finger drags wipe it too. */
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17'%3E%3Cpath d='M8.5 3v11M3 8.5h11' stroke='rgba(0,0,0,.25)' stroke-width='2.2'/%3E%3Cpath d='M8.5 3v11M3 8.5h11' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E") 8 8, crosshair;
  touch-action: pinch-zoom;
`;
// The way in appears once the name is written and the portfolio has loaded.
const Welcome = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 560px);
  text-align: center;
  color: var(--r95-color-headerText);
  transition: opacity 0.9s ease;
  &[data-open='false'] {
    opacity: 0;
    pointer-events: none;
  }
`;
const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;
// Kept for screen readers and search; the page shows only the glass and Enter.
const Title = styled.h1`
  ${visuallyHidden}
`;
// The loading page used to say this out loud; the glass is silent, so say it here.
const Status = styled.p`
  ${visuallyHidden}
`;
const Enter = styled(Button)`
  min-width: 112px;
  min-height: 36px;
  padding: 6px 18px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  &:focus-visible {
    outline: 2px dotted var(--r95-color-headerText);
    outline-offset: 5px;
  }
`;
const Address = styled.p`
  margin: 22px 0 0;
  font-size: 13px;
  letter-spacing: 0.08em;
  /* a soft halo keeps it legible on pale mist and on wiped-clear photo alike */
  text-shadow: 1px 1px var(--r95-color-borderDarkest), 0 0 6px rgba(0, 0, 0, 0.55);
`;
const EnterPage: React.FC = () => {
  const navigate = useNavigate();
  const welcome = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(portfolioReady);
  const [written, setWritten] = useState(false);
  const onWritten = useCallback(() => setWritten(true), []);
  const fogPhases = useMemo(() => [{ text: "BryBrie" }, { shape: "heart" as const }], []);

  // Fetch the portfolio behind the glass. If that fails, let Enter through
  // anyway and the route's own loader takes over.
  useEffect(() => {
    let live = true;
    const settle = (): void => {
      if (live) setLoaded(true);
    };
    loadPortfolio().then(settle, settle);
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded || written) return;
    const timer = window.setTimeout(onWritten, ENTER_ANYWAY_MS);
    return () => window.clearTimeout(timer);
  }, [loaded, written, onWritten]);

  const open = loaded && written;
  return (
    <Page>
      <FoggedGlass
        photoLeft={photo1}
        photoRight={photo2}
        font={roseAtelier}
        phases={fogPhases}
        above={welcome}
        onWritten={onWritten}
      />
      <Welcome ref={welcome} aria-labelledby="welcome-title" data-open={open}>
        <Title id="welcome-title">Bryanna Plaisir</Title>
        <Status role="status">{open ? 'Portfolio ready.' : 'Loading portfolio…'}</Status>
        <Enter type="button" disabled={!open} onClick={() => void navigate('/about')} aria-label="Enter Bryanna's portfolio">
          Enter <span aria-hidden="true">→</span>
        </Enter>
        <Address>brybrie.com</Address>
      </Welcome>
    </Page>
  );
};
export default EnterPage;
