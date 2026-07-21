import React from 'react';
import type { GalleryContent } from './types';

export const GalleryPanel: React.FC<{ content: GalleryContent }> = ({ content }) => (
  <section className="win95-panel">
    <h1 className="win95-pixel-heading">{content.heading}</h1>
    <p className="win95-bio-text">{content.intro}</p>
    <span className="win95-section-label">{content.sectionLabel}</span>
    <div className="win95-gallery-grid">
      {content.items.map((item) => (
        <div key={item.id} className="win95-gallery-tile win95-sunken">
          {item.imageUrl ? <img src={item.imageUrl} alt={item.alt ?? item.label} /> : item.label}
        </div>
      ))}
    </div>
  </section>
);
