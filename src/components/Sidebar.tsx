import React, { useState } from "react";
import type { CSSProperties } from "react";
import calendarIcon from '../assets/sidebar/calendar.png'
import letterIcon from '../assets/sidebar/letter.png'
import musicIcon from '../assets/sidebar/music.png'
import cardIcon from '../assets/sidebar/card.png'

type NavPage = "home" | "photos" | "about" | "pottery";

interface NavItem {
  id: NavPage;
  label: string;
  icon: any;
}

interface SidebarProps {
  /** Called when a nav icon is clicked — receives the page key */
  onNavigate: (page: NavPage) => void;
  /** Currently active page — highlights the active icon */
  activePage?: NavPage;
  /** Position the sidebar on the left or right. Default: "left" */
  side?: "left" | "right";
}

// ─────────────────────────────────────────────
// Nav items config — swap icons or labels here
// ─────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "home",    label: "Home",    icon: calendarIcon },
  { id: "photos", label: "Gallery", icon: cardIcon  },
  { id: "about",   label: "About",   icon: musicIcon    },
  { id: "pottery", label: "Travels", icon: letterIcon  },
];

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  icon: {
    width: "60px",
    height: "60px",
    imageRendering: "pixelated", // keeps pixel art crisp, no blurring
    objectFit: "contain",
  },

  sidebar: {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "16px 10px",
  },

  navButton: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    borderRadius: "14px",
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    transition: "background 0.2s ease, border-color 0.2s ease, transform 0.15s ease",
    outline: "none",
  },

  navButtonActive: {
    background: "rgba(168, 230, 240, 0.45)",
    border: "1px solid rgba(77, 184, 216, 0.5)",
    boxShadow: "0 2px 12px rgba(77, 184, 216, 0.25), inset 0 1px 0 rgba(255,255,255,0.7)",
  },

  tooltip: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(26, 74, 92, 0.85)",
    backdropFilter: "blur(8px)",
    color: "#e8f8ff",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "Nunito, system-ui, sans-serif",
    padding: "5px 10px",
    borderRadius: "8px",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    opacity: 0,
    transition: "opacity 0.18s ease",
    zIndex: 101,
  },

  divider: {
    width: "56px",
    height: "10px",
    background: "linear-gradient(90deg, transparent, rgba(77,184,216,0.4), transparent)",
    margin: "12px 0",
  },
};

// ─────────────────────────────────────────────
// Sidebar Component
// ─────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  activePage,
  side = "left",
}) => {
  const [hoveredId, setHoveredId] = useState<NavPage | null>(null);

  const sidebarPositionStyle: CSSProperties =
    side === "left" ? { left: "20px" } : { right: "20px" };

  return (
    <nav
      aria-label="Site navigation"
      style={{ ...styles.sidebar, ...sidebarPositionStyle }}
    >
      {NAV_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <React.Fragment key={item.id}>
            {/* Thin divider between items (skip before first) */}
            {index > 0 && <div style={styles.divider} />}

            <button
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                ...styles.navButton,
                ...(isActive ? styles.navButtonActive : {}),
                // Slight lift on hover
                transform: isHovered ? "scale(1.12)" : "scale(1)",
                background: isActive
                  ? styles.navButtonActive.background as string
                  : isHovered
                  ? "rgba(168, 230, 240, 0.22)"
                  : "transparent",
                border: isActive
                  ? styles.navButtonActive.border as string
                  : isHovered
                  ? "1px solid rgba(77, 184, 216, 0.3)"
                  : "1px solid transparent",
              }}
            >
              <img src={Icon} alt="" style={styles.icon} />


              <p
                style={{
                  flexDirection: "column",
                  position: "absolute",
                  inset: "55px 0px 0px 0px",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "sans-serif",
                  fontSize: "15px",
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {item.label}
              </p>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export type { NavPage, SidebarProps };
export default Sidebar;
