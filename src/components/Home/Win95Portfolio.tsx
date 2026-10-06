import React, {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defaultContent } from '../data';
import type {TabId, Win95PortfolioContent} from '../types';
import {Frame, List, Modal} from '@react95/core';
import {Mmsys113} from '@react95/icons';
import { useResponsiveMode } from '../useResponsiveMode';
import { useResponsiveScale } from '../useResponsiveScale';
import './win95Portfolio.css';
import {generateCascadePositions} from "../Gallery/cascadePositions.ts";
import {AboutPanel} from "../About/AboutPanel.tsx";
import {GalleryPanel} from "../Gallery/GalleryPanel.tsx";
import {ContactPanel} from "../Contact/ContactPanel.tsx";

const TAB_CONTENT_MIN_HEIGHT = 950;
export interface Win95PortfolioProps {
  content?: Win95PortfolioContent;
}

const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 600;
const MIN_SCALE = 0.4;
const MAX_SCALE = .85;
const PORTFOLIO_LEFT_OFFSET = 320; // > abs(website-modal's x: -300) + a little breathing room
const TAB_IDS: TabId[] = ['about', 'photos', 'ceramics', 'contact'];

/**
 * Routes to `to` as soon as it mounts, then renders nothing. react95's <Modal>
 * menu items open their `list` dropdown when clicked, so wiring one of these
 * (inside a hidden <List>) as a menu item's dropdown turns that top-level menu
 * label into a single-click navigation link — matching the old top-nav.
 */
const NavigateOnOpen: React.FC<{ to: string }> = ({ to }) => {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate(to);
  }, [navigate, to]);
  return null;
};

/** Build a menu entry whose label navigates to `to` on click. */
const navMenuItem = (name: string, to: string) => ({
  name,
  list: (
    <List style={{ display: 'none' }}>
      <NavigateOnOpen to={to} />
    </List>
  ),
});

// The main window's menu bar doubles as section navigation.
const PORTFOLIO_MENU = [
  navMenuItem('About', '/about'),
  navMenuItem('Photos', '/photos'),
  navMenuItem('Clay', '/ceramics'),
  navMenuItem('Contact', '/contact'),
];

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
        []
    );

  const { isDesktop } = useResponsiveMode();
  const rawScale = useResponsiveScale(DESIGN_WIDTH);
  const scale = Math.min(Math.max(rawScale, MIN_SCALE), MAX_SCALE);
  const innerRef = useRef<HTMLDivElement>(null);
  const [deadSpace, setDeadSpace] = useState(0);

  const location = useLocation();
  const pathTab = location.pathname.replace(/^\//, '') as TabId;
  const active: TabId = TAB_IDS.includes(pathTab) ? pathTab : 'about';


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
          <Frame boxShadow="$out" bgColor="$material" p="$12" minHeight="1400px">
              <Modal
                  className="portfolio-tab-modal"
                  icon={<Mmsys113 variant="32x32_4" />}
                  title="BRYANNA PLAISIR"
                  hasWindowButton={false}
                  titleBarOptions={<Modal.Minimize disabled title="Minimizing isn't available on mobile" />}
                  menu={PORTFOLIO_MENU}
              >
                  <Modal.Content p="$6">
              <div className="seamless-tab-panels" style={{ minHeight: TAB_CONTENT_MIN_HEIGHT }}>
                  <div
                      className={`seamless-tab-panel ${active === 'about' ? 'is-active' : ''}`}
                      aria-hidden={active !== 'about'}
                  >
                      <AboutPanel content={content.about} />
                  </div>
                  <div
                      className={`seamless-tab-panel ${active === 'photos' ? 'is-active' : ''}`}
                      aria-hidden={active !== 'photos'}
                  >
                      <GalleryPanel content={content.photos} />
                  </div>
                  <div
                      className={`seamless-tab-panel ${active === 'ceramics' ? 'is-active' : ''}`}
                      aria-hidden={active !== 'ceramics'}
                  >
                      <GalleryPanel content={content.ceramics} />
                  </div>
                  <div
                      className={`seamless-tab-panel ${active === 'contact' ? 'is-active' : ''}`}
                      aria-hidden={active !== 'contact'}
                  >
                      <ContactPanel />
                  </div>
              </div>
                  </Modal.Content>
              </Modal>
          </Frame>
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
                <Modal key={i} id={`website-modal-${i}`} icon={<Mmsys113 variant="32x32_4" />} title="BRIE CHEESE WEBSITE!!"
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
              <Modal
                  className="portfolio-tab-modal"
                  icon={<Mmsys113 variant="32x32_4" />}
                  title="BRYANNA PLAISIR"
                  hasWindowButton={false}
                  titleBarOptions={<Modal.Minimize />}
                  menu={PORTFOLIO_MENU}
              >
                  <Modal.Content p="$12">
                  <div className="seamless-tab-panels" style={{ minHeight: TAB_CONTENT_MIN_HEIGHT }}>
                      <div
                          className={`seamless-tab-panel ${active === 'about' ? 'is-active' : ''}`}
                          aria-hidden={active !== 'about'}
                      >
                          <AboutPanel content={content.about} />
                      </div>
                      <div
                          className={`seamless-tab-panel ${active === 'photos' ? 'is-active' : ''}`}
                          aria-hidden={active !== 'photos'}
                      >
                          <GalleryPanel content={content.photos} />
                      </div>
                      <div
                          className={`seamless-tab-panel ${active === 'ceramics' ? 'is-active' : ''}`}
                          aria-hidden={active !== 'ceramics'}
                      >
                          <GalleryPanel content={content.ceramics} />
                      </div>
                      <div
                          className={`seamless-tab-panel ${active === 'contact' ? 'is-active' : ''}`}
                          aria-hidden={active !== 'contact'}
                      >
                          <ContactPanel />
                      </div>
                  </div>
                      </Modal.Content>
              </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Win95Portfolio;
