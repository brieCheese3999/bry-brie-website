import React from 'react';
import {AboutPanel} from "../About/AboutPanel.tsx";
import {GalleryPanel} from "../Gallery/GalleryPanel.tsx";
import type {Win95PortfolioContent} from "../types";

export interface PortfolioWindowsProps {
  content: Win95PortfolioContent;
  /** Which windows are currently open (driven by the header nav). */
  open: PortfolioOpenState;
  /** Close a single window by key. */
  onClose: (key: keyof PortfolioOpenState) => void;
}

/**
 * The portfolio's three sections, each rendered as its own draggable Win95
 * window (About additionally spawns its photo / socials / contact sub-windows).
 * The header nav toggles which windows are open. On mobile each panel falls
 * back to a plain stacked column (handled inside the panels themselves) and the
 * open-state is ignored.
 */
export const PortfolioWindows: React.FC<PortfolioWindowsProps> = ({ content, open, onClose }) => (
  <>
    <AboutPanel
      content={content.about}
      open={{ about: open.about, photo: open.photo, socials: open.socials, contact: open.contact }}
      onClose={onClose}
    />
    <GalleryPanel
      content={content.photos}
      windowTitle="PHOTOS"
      defaultPosition={{ x: 20, y: 20 }}
      open={open.photos}
      onClose={() => onClose('photos')}
    />
    <GalleryPanel
      content={content.ceramics}
      windowTitle="CLAY WORKS"
      defaultPosition={{ x: 20, y: 20 }}
      open={open.ceramics}
      onClose={() => onClose('ceramics')}
    />
  </>
);
