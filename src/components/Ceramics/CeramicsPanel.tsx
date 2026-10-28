import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fieldset, Frame, Button } from '@react95/core';
import type { CeramicsContent, CeramicPiece, CeramicStatus } from '../types';
import { useResponsiveMode } from '../useResponsiveMode';
import { CeramicDetailView } from './CeramicDetailView';
import './ceramics.css';

type FilterValue = 'all' | CeramicStatus;

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'For Sale', value: 'for-sale' },
  { label: 'Showcase', value: 'showcase' },
];

interface CeramicsPanelProps {
  content: CeramicsContent;
  selectedPieceId?: string | null;
}

export const CeramicsPanel: React.FC<CeramicsPanelProps> = ({ content, selectedPieceId }) => {
  const { isMobile } = useResponsiveMode();
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<FilterValue>('all');

  const filtered = filter === 'all'
    ? content.items
    : content.items.filter((p) => p.status === filter);

  const selectedPiece = selectedPieceId
    ? content.items.find((p) => p.id === selectedPieceId) ?? null
    : null;

  const otherPieces = selectedPiece
    ? content.items.filter((p) => p.id !== selectedPiece.id)
    : [];

  if (selectedPiece) {
    return (
      <div className={isMobile ? 'win95-mobile-stack' : ''} style={{ paddingTop: '15px' }}>
        <CeramicDetailView
          piece={selectedPiece}
          otherPieces={otherPieces}
          onBack={() => navigate('/ceramics')}
          onSelectPiece={(id) => navigate(`/ceramics/${id}`)}
        />
      </div>
    );
  }

  return (
    <div className={isMobile ? 'win95-mobile-stack' : ''} style={{ paddingTop: '15px' }}>
      <Fieldset
        legend={content.heading}
        className={`win95-pixel-heading ${isMobile ? 'win95-mobile-fieldset' : ''}`}
        style={{ width: '100%' }}
      >
        <Frame display="flex" flexDirection="column">
          <div className="win95-icon-row">
            <span className="flex-break" />
            <p className="win95-bio-text">{content.intro}</p>
          </div>
        </Frame>
      </Fieldset>

      <div className="ceramics-filter-bar">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            className={filter === f.value ? 'ceramics-filter-active' : ''}
            onClick={() => setFilter(f.value)}
            style={{ fontSize: '15px', padding: '4px 16px' }}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Frame
          boxShadow="$in"
          bgColor="white"
          p="$12"
          style={{ textAlign: 'center', marginTop: '12px' }}
        >
          <p style={{ fontSize: '16px', color: '#666' }}>
            No pieces here yet — check back soon!
          </p>
        </Frame>
      ) : (
        <div className="ceramics-feed">
          {filtered.map((piece) => (
            <CeramicFeedCard
              key={piece.id}
              piece={piece}
              onClick={() => navigate(`/ceramics/${piece.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CeramicFeedCard: React.FC<{ piece: CeramicPiece; onClick: () => void }> = ({ piece, onClick }) => {
  const cover = piece.media[0];

  return (
    <button
      type="button"
      className="ceramics-feed-card"
      onClick={onClick}
      aria-label={`View piece: ${piece.title}`}
    >
      <div className="ceramics-feed-card-image">
        {cover ? (
          cover.type === 'video' ? (
            <video
              src={cover.src}
              poster={cover.poster}
              muted
              loop
              playsInline
              style={{ width: '100%', display: 'block' }}
            />
          ) : (
            <img
              src={cover.src}
              alt={cover.alt ?? piece.title}
              loading="lazy"
              style={{ width: '100%', display: 'block' }}
            />
          )
        ) : (
          <div className="ceramics-feed-card-placeholder">
            <span className="ceramics-feed-card-placeholder-text">Coming soon</span>
          </div>
        )}
        <span className={`ceramics-feed-card-badge ceramics-feed-card-badge--${piece.status}`}>
          {piece.status === 'for-sale' ? 'For Sale' : 'Showcase'}
        </span>
      </div>
      <div className="ceramics-feed-card-info">
        <span className="ceramics-feed-card-title">{piece.title}</span>
        {piece.status === 'for-sale' && piece.price != null && (
          <span className="ceramics-feed-card-price">${piece.price}.00</span>
        )}
      </div>
    </button>
  );
};
