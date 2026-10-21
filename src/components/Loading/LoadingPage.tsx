import { Frame } from '@react95/core';
import forest from './loading-forest-pixel.png';
import './LoadingPage.css';

/** Shared React95 loading window, with the original pixel Totoro. */
export default function LoadingPage() {
  return (
    <main className="totoro-loading-page" aria-label="Loading portfolio">
      <Frame className="loading-desktop-window" boxShadow="$out" bgColor="$material" padding="4px">
        <Frame className="loading-window-title" bgColor="$headerBackground" color="$headerText">
          <span className="loading-window-icon" aria-hidden="true">▣</span>
          <span>BRYANNA PLAISIR</span>
        </Frame>
        <Frame boxShadow="$in" className="loading-window-scene" style={{ backgroundImage: `url("${forest}")` }}>
      <div className="totoro-loading-content" role="status" aria-live="polite">
        <p className="totoro-speech">loading<span aria-hidden="true" className="totoro-loading-dots">...</span></p>
        <svg className="loading-totoro" viewBox="0 0 44 48" aria-hidden="true" shapeRendering="crispEdges">
          {/* Stepped ears, round body, little arms and feet. */}
          <path fill="#868a8e" d="M10 1h3v1h1v8h16V2h1V1h3v1h1v2h1v8h1v5h1v5h1v5h1v4h1v5h-2v5h-1v2h-2v2h-4v2h-5v-2H17v2h-5v-2H8v-2H6v-2H5v-5H3v-5h1v-4h1v-5h1v-5h1v-5h1V4h1V2h1z" />
          <path fill="#c3c7cb" d="M10 3h2v9h-2v4H9v6H8v6H7v9h1v5h3v2h22v-2h3v-5h1v-9h-1v-6h-1v-6h-1v-4h-2V3h1v2h1v8h-3v-1H13v1h-3z" />
          {/* White tummy with the familiar tiny chevrons. */}
          <path fill="#fefefe" d="M18 24h8v1h4v2h2v2h2v4h1v8h-2v2H11v-2H9v-8h1v-4h2v-2h2v-2h4z" />
          <g fill="#868a8e">
            <path d="M17 28h2v1h1v1h-1v-1h-2v1h-1v-1h1zM25 28h2v1h1v1h-1v-1h-2v1h-1v-1h1zM13 33h2v1h1v1h-1v-1h-2v1h-1v-1h1zM21 32h2v1h1v1h-1v-1h-2v1h-1v-1h1zM29 33h2v1h1v1h-1v-1h-2v1h-1v-1h1z" />
          </g>
          <g fill="#ffffff">
            <path d="M12 18h3v1h1v3h-1v1h-3v-1h-1v-3h1zM29 18h3v1h1v3h-1v1h-3v-1h-1v-3h1z" />
          </g>
          <g fill="#000000">
            <path d="M13 19h2v3h-2zM29 19h2v3h-2zM20 20h4v1h-1v1h-2v-1h-1z" />
          </g>
          <g fill="#868a8e">
            <path d="M2 16h4v1H2zM1 19h5v1H1zM2 23h4v1H2zM38 16h4v1h-4zM38 19h5v1h-5zM38 23h4v1h-4z" />
          </g>
        </svg>
      </div>
        </Frame>
        <Frame boxShadow="$in" className="loading-window-status">Opening portfolio…</Frame>
      </Frame>
    </main>
  );
}
