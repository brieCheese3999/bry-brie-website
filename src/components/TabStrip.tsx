import React from 'react';
import type { TabId } from './types';
import {Tabs, Tab} from "@react95/core";
import {AboutPanel} from "./AboutPanel.tsx";
import type {Win95PortfolioContent} from "./types";
import {GalleryPanel} from "./GalleryPanel.tsx";


export interface TabDefinition {
  id: TabId;
  label: string;
}

export interface TabStripProps {
  tabs: TabDefinition[];
  content?: Win95PortfolioContent;
}

export const TabStrip: React.FC<TabStripProps> = ({ tabs , content}) => {
  return (
    <Tabs width="1000px" defaultActiveTab="about">
      {tabs.map((tab) => (
        <Tab title={tab.id} key={tab.id}>
          {tab.id === "about" && <AboutPanel content={content.about} />}
          {tab.id === 'photos' && <GalleryPanel content={content.photos} />}
          {tab.id === 'ceramics' && <GalleryPanel content={content.ceramics} />}
        </Tab>
      ))}
    </Tabs>
  );
};
