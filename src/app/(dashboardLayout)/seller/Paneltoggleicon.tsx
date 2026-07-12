import React from "react";

interface PanelToggleIconProps {
  collapsed: boolean;
}

/**
 * A rounded rectangle divided by a vertical bar, with the "open" side
 * filled solid — mirrors the classic sidebar-toggle icon (VS Code, Linear, etc).
 */
export default function PanelToggleIcon({ collapsed }: PanelToggleIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="2.5"
        width="15"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {collapsed ? (
        /* collapsed: only the narrow left rail is filled → sidebar is shut */
        <rect x="1.5" y="2.5" width="5.5" height="13" rx="2" fill="currentColor" />
      ) : (
        /* open: the wide left pane is filled → sidebar is showing */
        <rect x="1.5" y="2.5" width="9.5" height="13" rx="2" fill="currentColor" />
      )}
    </svg>
  );
}