import React, { useRef, useState } from 'react';
import { TitleBar } from './TitleBar';
import { MenuBar } from './MenuBar';
import { TabStrip } from './TabStrip.tsx';
import type { TabDefinition } from './TabStrip';
import { FloatingWindow } from './FloatingWindow';
import { ErrorDialog } from './ErrorDialog';
import { Taskbar } from './Taskbar';
import { AboutPanel } from './AboutPanel';
import { GalleryPanel } from './GalleryPanel';
import { defaultContent } from './data';
import type { TabId, Win95PortfolioContent } from './types';
import {Button, Frame, Modal} from '@react95/core';
import './win95Portfolio.css';

const TABS: TabDefinition[] = [
  { id: 'about', label: 'about me' },
  { id: 'photos', label: 'photos' },
  { id: 'ceramics', label: 'ceramics' },
];

export interface Win95PortfolioProps {
  content?: Win95PortfolioContent;
}

export const Win95Portfolio: React.FC<Win95PortfolioProps> = ({ content = defaultContent }) => {
  const [activeTab, setActiveTab] = useState<TabId>('about');
  const [photoWindowVisible, setPhotoWindowVisible] = useState(true);
  const [socialsWindowVisible, setSocialsWindowVisible] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="win95-portfolio">
      <div className="win95-window">
        <TitleBar
          title={content.windowTitle}
          onMinimize={() => {}}
          onMaximize={() => {}}
          onClose={() => setErrorVisible(true)}
        />
        <MenuBar />
        <TabStrip tabs={TABS} content={content} />

        </div>
    </div>
  );
};

export default Win95Portfolio;
