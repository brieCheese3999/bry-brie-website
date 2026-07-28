import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TabId } from '../types';
import {Tabs, Tab, Frame} from "@react95/core";
import {AboutPanel} from "../About/AboutPanel.tsx";
import type {Win95PortfolioContent} from "../types";
import {GalleryPanel} from "../Gallery/GalleryPanel.tsx";


export interface TabDefinition {
  id: TabId;
  label: string;
}

export interface TabStripProps {
  tabs: TabDefinition[];
  content: Win95PortfolioContent;
}

const TAB_CONTENT_MIN_HEIGHT = 950;

const TAB_IDS: TabId[] = ['about', 'photos', 'ceramics'];

export const TabStrip: React.FC<TabStripProps> = ({ tabs , content}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // The URL is the source of truth for which tab is active. Each tab maps to a
  // route (/about, /photos, /ceramics); clicking a tab navigates and the
  // pathname drives which panel is shown.
  const pathTab = location.pathname.replace(/^\//, '') as TabId;
  const active: TabId = TAB_IDS.includes(pathTab) ? pathTab : 'about';

  // We keep react95's <Tabs> purely for the tab-strip visuals, but render the
  // panels ourselves so all three stay mounted at once. react95's own Tabs
  // unmounts every inactive tab, which forced each panel to rebuild on every
  // switch — reloading gallery images and re-measuring orientations, which is
  // what made switching feel choppy. Mounting all panels up front lets a
  // switch be a pure CSS crossfade with no layout work.
  //
  // `key={active}` remounts <Tabs> whenever the route changes so its internal
  // highlight re-syncs to defaultActiveTab — this keeps the visual selection
  // correct on direct navigation and browser back/forward, not just clicks.
  return (
    <div className="seamless-tabs">
      <Tabs
        key={active}
        defaultActiveTab={active}
        onChange={(title) => navigate(`/${title}`)}
      >
        {tabs.map((tab) => (
          <Tab title={tab.id} key={tab.id} style={{fontSize:"24px"}} />
        ))}
      </Tabs>
      <Frame boxShadow="$out" bgColor="$material" p="$12">
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
        </div>
      </Frame>
    </div>
  );
};
