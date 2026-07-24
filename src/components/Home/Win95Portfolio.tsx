import React from 'react';
import { TabStrip } from './TabStrip.tsx';
import type { TabDefinition } from './TabStrip';
import { defaultContent } from '../data';
import type { Win95PortfolioContent } from '../types';
import { Frame, List, Modal } from '@react95/core';
import {Mmsys113} from '@react95/icons';
import { useResponsiveMode } from '../useResponsiveMode';
import { useResponsiveScale } from '../useResponsiveScale';
import './win95Portfolio.css';

const TABS: TabDefinition[] = [
  { id: 'about', label: 'about me' },
  { id: 'photos', label: 'photos' },
  { id: 'ceramics', label: 'ceramics' },
];

export interface Win95PortfolioProps {
  content?: Win95PortfolioContent;
}

// The desktop layout below is built with fixed pixel widths and fixed pixel
// dragOptions coordinates, so nothing in it naturally reflows on its own when
// the browser window is resized. Instead, on desktop/tablet we render it at
// this fixed "design" size and scale the whole thing up/down to match the
// current window width — same idea as scaling an image. Everything inside
// (text, icons, floating windows) scales together proportionally, preserving
// the exact original arrangement.
const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 600;

// A single scale factor (from useResponsiveScale, based on window width) is
// applied to both width and height, so the scaled stage always keeps the
// design's exact aspect ratio (1600:1000). Whenever the browser window's own
// aspect ratio doesn't match that, there's leftover space in one dimension —
// same as "letterboxing" a video. These bounds keep the scale from getting
// absurd on extreme window shapes/sizes (e.g. a very tall, narrow window).
const MIN_SCALE = 0.4;
const MAX_SCALE = .85;

// website-modal uses a NEGATIVE x (-300), meaning it's dragged to the left of
// the natural origin — paddingLeft (applied inside the scaled stage below)
// shifts the whole layout right so that negative offset still lands in
// positive, reachable space instead of being clipped off the left edge.
const PORTFOLIO_LEFT_OFFSET = 320; // > abs(website-modal's x: -300) + a little breathing room

export const Win95Portfolio: React.FC<Win95PortfolioProps> = ({ content = defaultContent }) => {
  const { isDesktop } = useResponsiveMode();
  const rawScale = useResponsiveScale(DESIGN_WIDTH);
  const scale = Math.min(Math.max(rawScale, MIN_SCALE), MAX_SCALE);

    if (!isDesktop) {
    return (
      <div className="win95-mobile-root">
        <TabStrip tabs={TABS} content={content} />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: DESIGN_WIDTH * scale,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: DESIGN_WIDTH,
              minHeight: DESIGN_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
                padding:"80px",
            }}
          >
            <Frame>
              <TabStrip tabs={TABS} content={content} />
              <Modal id="website-modal" icon={<Mmsys113 variant="32x32_4" />} title="BRIE CHEESE WEBSITE!!"
              titleBarOptions={<Modal.Minimize />} menu={[{
                name: 'File',
                list: <List/>
              }, {
                name: 'Edit',
                list: <List/>
              }]} dragOptions={{ defaultPosition: { x: -300 + PORTFOLIO_LEFT_OFFSET, y: 105 } }}>

              </Modal>
            </Frame>
          </div>
        </div>
      </div>
    </>
  );
};

export default Win95Portfolio;
