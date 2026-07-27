import React from 'react';
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

export const TabStrip: React.FC<TabStripProps> = ({ tabs , content}) => {
  const [active, setActive] = React.useState<TabId>('about');

  // We keep react95's <Tabs> purely for the tab-strip visuals, but render the
  // panels ourselves so all three stay mounted at once. react95's own Tabs
  // unmounts every inactive tab, which forced each panel to rebuild on every
  // switch — reloading gallery images and re-measuring orientations, which is
  // what made switching feel choppy. Mounting all panels up front lets a
  // switch be a pure CSS crossfade with no layout work.
  return (
    <div className="seamless-tabs">
      <Tabs
        defaultActiveTab="about"
        onChange={(title) => setActive(title as TabId)}
        className="r95-light"
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
