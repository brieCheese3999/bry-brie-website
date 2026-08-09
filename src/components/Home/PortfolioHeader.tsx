import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiInstagram, FiMail, FiMoon } from 'react-icons/fi';
import type { TabId } from '../types';
import './portfolioHeader.css';

interface NavItem {
  /** Route/tab this item maps to. */
  id: TabId;
  label: string;
}

// CLAY is the display label for the ceramics tab/route.
const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'ABOUT' },
  { id: 'photos', label: 'PHOTOS' },
  { id: 'ceramics', label: 'CLAY' },
  { id: 'contact', label: 'CONTACT' },
];

const TAB_IDS: TabId[] = ['about', 'photos', 'ceramics', 'contact'];

export interface PortfolioHeaderProps {
  /** External Instagram profile URL. */
  instagramUrl: string;
}

/**
 * Clean top navigation bar that sits above the Win95 portfolio. The active
 * section is driven by the URL (each nav item navigates to /about, /photos,
 * /ceramics or /contact), which is the same source of truth Win95Portfolio
 * uses to decide which panel to show — so clicking a link swaps the panel.
 *
 * The moon button is a visual-only placeholder; light/dark theming is a later
 * pass.
 */
export const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ instagramUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathTab = location.pathname.replace(/^\//, '') as TabId;
  const active: TabId = TAB_IDS.includes(pathTab) ? pathTab : 'about';

  return (
    <header className="portfolio-header">
      <button
        type="button"
        className="portfolio-header__logo"
        onClick={() => navigate('/about')}
        aria-label="Bryanna Plaisir — home"
      >
        {'Bryanna\nPlaisir'}
      </button>

      <nav className="portfolio-header__nav" aria-label="Sections">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`portfolio-header__link ${active === item.id ? 'is-active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
            onClick={() => navigate(`/${item.id}`)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="portfolio-header__actions">
        <a
          className="portfolio-header__icon-btn"
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FiInstagram size={20} />
        </a>
        <button
          type="button"
          className="portfolio-header__icon-btn"
          onClick={() => navigate('/contact')}
          aria-label="Contact"
        >
          <FiMail size={20} />
        </button>
        <button
          type="button"
          className="portfolio-header__icon-btn portfolio-header__theme"
          aria-label="Toggle dark mode"
          title="Dark mode (coming soon)"
        >
          <FiMoon size={18} />
        </button>
      </div>
    </header>
  );
};

export default PortfolioHeader;
