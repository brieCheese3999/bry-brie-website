import React, {useEffect, useRef, useState} from 'react';
import { TabStrip } from './TabStrip.tsx';
import type { TabDefinition } from './TabStrip';
import { defaultContent } from '../data';
import type { Win95PortfolioContent } from '../types';
import { Frame, List, Modal } from '@react95/core';
import {Mmsys113} from '@react95/icons';
import { useResponsiveMode } from '../useResponsiveMode';
import { useResponsiveScale } from '../useResponsiveScale';
import './win95Portfolio.css';
import {generateCascadePositions} from "../Gallery/cascadePositions.ts";

const TABS: TabDefinition[] = [
  { id: 'about', label: 'about me' },
  { id: 'photos', label: 'photos' },
  { id: 'ceramics', label: 'ceramics' },
];

export interface Win95PortfolioProps {
  content?: Win95PortfolioContent;
}

const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 600;
const MIN_SCALE = 0.4;
const MAX_SCALE = .85;
const PORTFOLIO_LEFT_OFFSET = 320; // > abs(website-modal's x: -300) + a little breathing room

export const Win95Portfolio: React.FC<Win95PortfolioProps> = ({ content = defaultContent }) => {
    const positions = React.useMemo(
        () =>
            generateCascadePositions(5, {
                columnStarts: [
                    { x: -530 + PORTFOLIO_LEFT_OFFSET, y: 465 },
                ],
                stepX: 12,
                stepY: 10,
            }),
        [15]
    );

  const { isDesktop } = useResponsiveMode();
  const rawScale = useResponsiveScale(DESIGN_WIDTH);
  const scale = Math.min(Math.max(rawScale, MIN_SCALE), MAX_SCALE);
  const innerRef = useRef<HTMLDivElement>(null);
  const [deadSpace, setDeadSpace] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setDeadSpace(el.offsetHeight * (1 - scale));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [scale]);

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
            ref={innerRef}
            style={{
              position: 'relative',
              width: DESIGN_WIDTH,
              minHeight: DESIGN_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              marginBottom: -deadSpace,
              padding:"80px",
            }}
          >
            <div className="website-modals-behind">
              {positions.map((pos, i) => (
                <Modal key={i} className="r95-light" id={`website-modal-${i}`} icon={<Mmsys113 variant="32x32_4" />} title="BRIE CHEESE WEBSITE!!"
                  hasWindowButton={false} titleBarOptions={<Modal.Minimize />} menu={[{
                    name: 'File',
                    list: <List/>
                  }, {
                    name: 'Edit',
                    list: <List/>
                  }]} dragOptions={{ defaultPosition: { x: pos.x, y: pos.y } }}>
                </Modal>
              ))}
            </div>
            <Frame>
              <TabStrip tabs={TABS} content={content} />
            </Frame>
          </div>
        </div>
      </div>
    </>
  );
};

export default Win95Portfolio;
