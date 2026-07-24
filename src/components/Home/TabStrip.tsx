import React from 'react';
import type { TabId } from '../types';
import {Tabs, Tab} from "@react95/core";
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
  return (
    <Tabs defaultActiveTab="about">
      {tabs.map((tab) => (
        <Tab title={tab.id} key={tab.id} style={{fontSize:"24px"}}>
          <div style={{ minHeight: TAB_CONTENT_MIN_HEIGHT }}>
            {tab.id === "about" && <AboutPanel content={content.about} />}
            {tab.id === 'photos' && <GalleryPanel content={content.photos} />}
            {tab.id === 'ceramics' && <GalleryPanel content={content.ceramics} />}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};
