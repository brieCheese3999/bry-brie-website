import React from 'react';
import { Frame, Button } from '@react95/core';
import type { CeramicPiece } from '../types';
import { useResponsiveMode } from '../useResponsiveMode';

interface CeramicDetailViewProps {
  piece: CeramicPiece;
  otherPieces: CeramicPiece[];
  onBack: () => void;
  onSelectPiece: (id: string) => void;
}

export const CeramicDetailView: React.FC<CeramicDetailViewProps> = ({
  piece,
  otherPieces,
  onBack,
  onSelectPiece,
}) => {
  const { isMobile } = useResponsiveMode();
  const [mediaIndex, setMediaIndex] = React.useState(0);
  const currentMedia = piece.media[mediaIndex];
  const hasMultiple = piece.media.length > 1;

  React.useEffect(() => {
    setMediaIndex(0);
  }, [piece.id]);

  const goPrev = () =>
    setMediaIndex((i) => (i - 1 + piece.media.length) % piece.media.length);
  const goNext = () =>
    setMediaIndex((i) => (i + 1) % piece.media.length);

  React.useEffect(() => {
    if (!hasMultiple) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasMultiple, piece.media.length]);

  const renderMedia = () => {
    if (piece.media.length === 0) {
      return (
        <div className="ceramic-detail-carousel win95-sunken">
          <div className="ceramic-detail-carousel-placeholder">
            <span style={{ fontSize: '17px', color: '#888' }}>Coming soon</span>
          </div>
        </div>
      );
    }

    if (isMobile) {
      return (
        <>
          <div className="ceramic-detail-carousel win95-sunken">
            {currentMedia?.type === 'video' ? (
              <video
                key={currentMedia.src}
                src={currentMedia.src}
                poster={currentMedia.poster}
                controls muted loop playsInline
                             />
            ) : currentMedia ? (
              <img
                src={currentMedia.src}
                alt={currentMedia.alt ?? piece.title}
                             />
            ) : null}
            {hasMultiple && (
              <>
                <button type="button" className="ceramic-detail-arrow ceramic-detail-arrow--prev win95-raised" onClick={goPrev} aria-label="Previous image">&#9664;</button>
                <button type="button" className="ceramic-detail-arrow ceramic-detail-arrow--next win95-raised" onClick={goNext} aria-label="Next image">&#9654;</button>
              </>
            )}
          </div>
          {hasMultiple && (
            <div className="ceramic-detail-indicator">
              {mediaIndex + 1} / {piece.media.length}
            </div>
          )}
        </>
      );
    }

    return (
      <div className="ceramic-detail-images">
        {piece.media.map((m, i) => (
          <div key={i} className="ceramic-detail-image-item win95-sunken">
            {m.type === 'video' ? (
              <video src={m.src} poster={m.poster} controls muted loop playsInline style={{ width: '100%', display: 'block' }} />
            ) : (
              <img src={m.src} alt={m.alt ?? piece.title} style={{ width: '100%', display: 'block' }} />
            )}
          </div>
        ))}
        {piece.media.length === 0 && (
          <div className="ceramic-detail-image-item win95-sunken">
            <div className="ceramic-detail-carousel-placeholder">
              <span style={{ fontSize: '17px', color: '#888' }}>Coming soon</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInfo = () => (
    <div className="ceramic-detail-info">
      <h2 className="ceramic-detail-name">{piece.title}</h2>
      {piece.year && <span className="ceramic-detail-year">{piece.year}</span>}

      <div className="ceramic-detail-price-row">
        {piece.status === 'for-sale' && piece.price != null && (
          <span className="ceramic-detail-price">${piece.price}.00</span>
        )}
        <span className={`ceramic-detail-status ceramic-detail-status--${piece.status}`}>
          {piece.status === 'for-sale' ? 'For Sale' : 'Showcase'}
        </span>
        {piece.status === 'for-sale' && piece.etsyUrl ? (
          <a
            className="ceramic-detail-action-btn"
            href={piece.etsyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop on Etsy
          </a>
        ) : (
          <a
            className="ceramic-detail-action-btn"
            href={`/contact?subject=${encodeURIComponent(`Inquiry about: ${piece.title}`)}`}
          >
            Inquire
          </a>
        )}
      </div>

      <p className="ceramic-detail-description">{piece.blurb}</p>

      {(piece.technique || piece.clay || piece.glaze || piece.dimensions) && (
        <div className="ceramic-detail-specs-section">
          {piece.dimensions && (
            <p className="ceramic-detail-spec-line">Approximate Size: {piece.dimensions}</p>
          )}
          {piece.technique && (
            <p className="ceramic-detail-spec-line">Technique: {piece.technique}</p>
          )}
          {piece.clay && (
            <p className="ceramic-detail-spec-line">Clay: {piece.clay}</p>
          )}
          {piece.glaze && (
            <p className="ceramic-detail-spec-line">Glaze: {piece.glaze}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="ceramic-detail">
      <Button
        onClick={onBack}
        style={{ fontSize: '17px', padding: '4px 14px', marginBottom: '16px' }}
      >
        &#8592; Back to pieces
      </Button>

      {isMobile ? (
        <div className="ceramic-detail-mobile">
          {renderMedia()}
          {renderInfo()}
        </div>
      ) : (
        <div className="ceramic-detail-desktop">
          <div className="ceramic-detail-left">
            {renderMedia()}
          </div>
          <div className="ceramic-detail-right">
            {renderInfo()}
          </div>
        </div>
      )}

      {otherPieces.length > 0 && (
        <div className="ceramic-also-like">
          <h3 className="ceramic-also-like-heading">You may also like</h3>
          <div className="ceramic-also-like-grid">
            {otherPieces.slice(0, 4).map((p) => {
              const cover = p.media[0];
              return (
                <button
                  key={p.id}
                  type="button"
                  className="ceramics-feed-card"
                  onClick={() => onSelectPiece(p.id)}
                  aria-label={`View piece: ${p.title}`}
                >
                  <div className="ceramics-feed-card-image">
                    {cover ? (
                      cover.type === 'video' ? (
                        <video src={cover.src} poster={cover.poster} muted loop playsInline style={{ width: '100%', display: 'block' }} />
                      ) : (
                        <img src={cover.src} alt={cover.alt ?? p.title} loading="lazy" style={{ width: '100%', display: 'block' }} />
                      )
                    ) : (
                      <div className="ceramics-feed-card-placeholder">
                        <span className="ceramics-feed-card-placeholder-text">Coming soon</span>
                      </div>
                    )}
                    <span className={`ceramics-feed-card-badge ceramics-feed-card-badge--${p.status}`}>
                      {p.status === 'for-sale' ? 'For Sale' : 'Showcase'}
                    </span>
                  </div>
                  <div className="ceramics-feed-card-info">
                    <span className="ceramics-feed-card-title">{p.title}</span>
                    {p.status === 'for-sale' && p.price != null && (
                      <span className="ceramics-feed-card-price">${p.price}.00</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
