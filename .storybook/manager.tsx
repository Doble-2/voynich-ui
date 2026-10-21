import { addons } from 'storybook/manager-api';
import voynichTheme from './voynich-theme';

addons.setConfig({
  theme: voynichTheme,
  sidebar: {
    showRoots: true,
  },
  showPanel: true,
  enableShortcuts: true,
  whatsNewNotifications: false,
});

/* ──────────────────────────────────────────────
   Programmatically dismiss Storybook onboarding
   ────────────────────────────────────────────── */
try {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    const lk = key.toLowerCase();
    if (lk.includes('onboarding') || lk.includes('checklist') || lk.includes('whats-new') || lk.includes('whatsnew')) {
      localStorage.removeItem(key);
    }
  }
  localStorage.setItem('@storybook/addon-onboarding/v1', JSON.stringify({ completed: true, dismissed: true }));
} catch (_) { /* ignore in non-browser env */ }

/* ══════════════════════════════════════════════════════════
   DEEP CSS OVERRIDES — Premium manuscript-grade UI chrome
   ══════════════════════════════════════════════════════════ */
const style = document.createElement('style');
style.textContent = `
  /* ── Fonts ── */
  @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=JetBrains+Mono:wght@300;400&display=swap');

  /* ── Global transitions ── */
  * {
    scrollbar-color: rgba(139,106,62,0.12) transparent;
  }

  /* ══ SIDEBAR ══ */
  nav[class*="sidebar"] {
    background: linear-gradient(180deg, #060402 0%, #080503 40%, #060402 100%) !important;
    border-right: 1px solid rgba(42,29,18,0.25) !important;
  }

  /* Root category headers */
  button[data-nodetype="root"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.58rem !important;
    letter-spacing: 0.22em !important;
    text-transform: uppercase !important;
    color: #7a6b50 !important;
    padding-top: 1.4rem !important;
    padding-bottom: 0.3rem !important;
    opacity: 1 !important;
    position: relative !important;
  }
  /* Category underline */
  button[data-nodetype="root"]::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1rem;
    right: 1rem;
    height: 1px;
    background: linear-gradient(90deg, rgba(139,106,62,0.15), rgba(139,106,62,0.04));
  }

  /* Story/component items */
  a[data-nodetype="story"],
  a[data-nodetype="document"],
  button[data-nodetype="component"],
  button[data-nodetype="group"] {
    font-family: 'IM Fell English', Georgia, serif !important;
    font-size: 0.82rem !important;
    color: #9a8a68 !important;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
    border-radius: 3px !important;
    position: relative !important;
  }
  a[data-nodetype="story"]:hover,
  a[data-nodetype="document"]:hover,
  button[data-nodetype="component"]:hover,
  button[data-nodetype="group"]:hover {
    color: #c9a95f !important;
    background: rgba(201,169,95,0.03) !important;
    padding-left: calc(0.5rem + 2px) !important;
  }

  /* Selected state — elegant gold accent */
  a[data-selected="true"],
  a[data-nodetype][data-selected="true"] {
    color: #c9a95f !important;
    background: rgba(201,169,95,0.06) !important;
    font-weight: 400 !important;
    box-shadow: inset 2px 0 0 #c9a95f !important;
    border-radius: 0 3px 3px 0 !important;
  }

  /* ══ SCROLLBAR ══ */
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(139,106,62,0.1);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(139,106,62,0.25);
  }

  /* ══ SEARCH FIELD ══ */
  input[placeholder*="Find"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.7rem !important;
    letter-spacing: 0.04em !important;
    background: #050302 !important;
    border: 1px solid rgba(42,29,18,0.2) !important;
    color: #7a6b4e !important;
    transition: all 0.35s ease !important;
    border-radius: 4px !important;
  }
  input[placeholder*="Find"]:focus {
    border-color: rgba(201,169,95,0.25) !important;
    box-shadow: 0 0 0 2px rgba(201,169,95,0.04), 0 0 12px rgba(201,169,95,0.03) !important;
    background: #080503 !important;
  }

  /* ══ TOOLBAR ══ */
  div[role="tablist"] button,
  button[title] {
    transition: color 0.3s ease, opacity 0.3s ease !important;
  }
  div[role="tablist"] button:hover,
  button[title]:hover {
    color: #c9a95f !important;
  }

  /* ══ ADDON PANEL ══ */
  div[class*="tabbar"] {
    border-top: 1px solid rgba(42,29,18,0.2) !important;
    background: #060402 !important;
  }

  /* Panel tabs — refined */
  button[role="tab"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.65rem !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    transition: all 0.3s ease !important;
    border-bottom: 1px solid transparent !important;
  }
  button[role="tab"][aria-selected="true"] {
    color: #c9a95f !important;
    border-bottom-color: rgba(201,169,95,0.4) !important;
  }

  /* ══ CONTROLS PANEL ══ */
  /* Control labels */
  td[class*="name"] label,
  td label {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.68rem !important;
    color: #6b5e45 !important;
    letter-spacing: 0.02em !important;
  }

  /* Control descriptions */
  td[class*="description"],
  p[class*="description"] {
    font-family: 'IM Fell English', Georgia, serif !important;
    font-size: 0.72rem !important;
    color: #4a3d28 !important;
    font-style: italic !important;
  }

  /* Table rows on hover */
  tr:hover {
    background: rgba(201,169,95,0.015) !important;
  }

  /* Control inputs */
  input[class*="input"],
  select[class*="select"],
  textarea {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.72rem !important;
    transition: border-color 0.25s ease !important;
  }

  /* ══ DOCS PAGE ══ */
  /* Docs title */
  h1[class*="title"],
  .sbdocs h1 {
    font-family: 'IM Fell English', Georgia, serif !important;
    color: #c9a95f !important;
    letter-spacing: 0.02em !important;
    font-weight: 400 !important;
  }

  /* Docs description text */
  .sbdocs p,
  .sbdocs li {
    font-family: 'IM Fell English', Georgia, serif !important;
    color: #8a7b5e !important;
    line-height: 1.7 !important;
  }

  /* Docs code blocks */
  .sbdocs code,
  .sbdocs pre {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.72rem !important;
    background: #080503 !important;
    border: 1px solid rgba(42,29,18,0.2) !important;
    color: #b0a07a !important;
  }

  /* Story preview wrapper in docs */
  .sbdocs .docblock-code-toggle,
  div[class*="StoryBlock"] {
    border: 1px solid rgba(42,29,18,0.15) !important;
    border-radius: 4px !important;
    overflow: hidden !important;
  }

  /* ══ TOOLBAR ICONS ══ */
  /* Zoom/grid/viewport toolbar area */
  div[class*="tools"] {
    border-bottom: 1px solid rgba(42,29,18,0.12) !important;
    background: rgba(6,4,2,0.6) !important;
    backdrop-filter: blur(8px) !important;
  }

  /* ══ HIDE ONBOARDING & NOTIFICATIONS ══ */
  [class*="Onboarding"],
  [id*="onboarding"],
  [class*="onboarding"],
  [class*="checklist"],
  [class*="Checklist"],
  [class*="Highlight"],
  [class*="highlight-"],
  [class*="WhatsNew"],
  [class*="whatsnew"],
  [class*="whats-new"],
  [class*="GetStarted"],
  [class*="get-started"],
  #storybook-explorer-menu > div:first-child:has(button[class*="collapse"]) {
    display: none !important;
  }
  div[class*="NotificationList"],
  [class*="notification-list"],
  div[class*="ToastContainer"],
  [class*="toast"] {
    display: none !important;
  }

  /* Hide the "Show new and modified stories" badge */
  button[class*="StatusButton"],
  div[class*="StatusLabel"],
  /* The blue dot / "new stories" link text */
  button[class*="status"],
  [class*="StatusDot"],
  [class*="status-dot"] {
    display: none !important;
  }
  /* Hide the entire new-stories announcement area in sidebar */
  nav[class*="sidebar"] > div > div:has(> button:first-child) > button:has(svg circle[fill]) {
    display: none !important;
  }
  /* Broader catch for "Show new" text */
  a[href*="new-and-modified"],
  button:has(+ span:empty) {
    /* no-op — intentional placeholder */
  }

  /* ══ BRAND AREA ══ */
  a[class*="brand"] {
    padding: 0.8rem 0 !important;
    opacity: 0.95 !important;
    transition: opacity 0.3s ease !important;
  }
  a[class*="brand"]:hover {
    opacity: 1 !important;
  }

  /* ══ SIDEBAR BOTTOM SECTION ══ */
  /* Subtle footer glow at bottom of sidebar */
  nav[class*="sidebar"]::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(201,169,95,0.015), transparent);
    pointer-events: none;
  }

  /* ══ ICON REFINEMENTS ══ */
  /* Component/story icons in sidebar */
  svg[class*="icon"],
  button[data-nodetype] svg {
    opacity: 0.4 !important;
    transition: opacity 0.3s ease !important;
  }
  button[data-nodetype]:hover svg,
  a[data-nodetype]:hover svg {
    opacity: 0.7 !important;
  }
  a[data-selected="true"] svg {
    opacity: 0.85 !important;
    color: #c9a95f !important;
  }

  /* ══ STORY PREVIEW BORDER ══ */
  /* Add a subtle frame around the preview pane */
  #storybook-preview-wrapper {
    border-left: 1px solid rgba(42,29,18,0.12) !important;
  }

  /* ══ EMPTY STATE REFINEMENT ══ */
  div[class*="EmptyBlock"],
  div[class*="empty"] {
    font-family: 'IM Fell English', Georgia, serif !important;
    color: #4a3d28 !important;
    font-style: italic !important;
  }

  /* ══ ADDON PANEL — ARGS TABLE ══ */
  /* Table header cells */
  th {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.6rem !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    color: #3d3020 !important;
    border-bottom-color: rgba(42,29,18,0.15) !important;
  }

  /* Table cell borders */
  td {
    border-bottom-color: rgba(42,29,18,0.08) !important;
  }

  /* Boolean toggle switches */
  label[class*="toggle"],
  span[class*="toggle"] {
    transition: all 0.25s ease !important;
  }

  /* Range slider track */
  input[type="range"] {
    accent-color: #c9a95f !important;
  }

  /* Color picker dot */
  div[class*="swatch"],
  div[class*="color-swatch"] {
    border: 1px solid rgba(42,29,18,0.3) !important;
    border-radius: 3px !important;
  }
`;
document.head.appendChild(style);

/* ══════════════════════════════════════════════════════════
   DOM surgery — hide onboarding widgets
   ══════════════════════════════════════════════════════════ */
let attempts = 0;
const maxAttempts = 200;

const nukeWidgets = () => {
  if (attempts++ > maxAttempts) return;

  const allButtons = document.querySelectorAll('button');
  for (const btn of allButtons) {
    const text = btn.textContent || '';
    if (text.includes('Get started') && text.match(/\d+%/)) {
      let el: HTMLElement | null = btn;
      for (let i = 0; i < 6 && el; i++) {
        el.style.display = 'none';
        el = el.parentElement;
        if (el) {
          const cs = window.getComputedStyle(el);
          if (cs.borderStyle !== 'none' && cs.borderWidth !== '0px') {
            el.style.display = 'none';
            el.style.height = '0';
            el.style.overflow = 'hidden';
            el.style.margin = '0';
            el.style.padding = '0';
            el.style.border = 'none';
            break;
          }
        }
      }
    }
    if (text.match(/^\s*\d+%\s*$/) && btn.querySelector('svg')) {
      let el: HTMLElement | null = btn.parentElement;
      if (el) {
        const cs = window.getComputedStyle(el);
        if (cs.borderStyle !== 'none') {
          el.style.display = 'none';
        }
      }
    }
  }

  document.querySelectorAll('div').forEach(div => {
    const text = div.textContent || '';
    if (text.includes('Storybook 10') && text.includes('Learn') && div.offsetHeight > 40 && div.offsetHeight < 120) {
      div.style.display = 'none';
    }
  });

  // Hide "Show new and modified stories" link/button — only hide the element itself, never parents
  document.querySelectorAll('button, a, span').forEach(el => {
    const text = (el as HTMLElement).textContent || '';
    if (text.includes('Show new and modified') || text.includes('new and modified stories')) {
      (el as HTMLElement).style.display = 'none';
      // Also hide the blue dot sibling if present
      const sibling = (el as HTMLElement).previousElementSibling;
      if (sibling && sibling.tagName === 'SPAN') {
        (sibling as HTMLElement).style.display = 'none';
      }
    }
  });

  setTimeout(nukeWidgets, 50);
};
setTimeout(nukeWidgets, 200);
