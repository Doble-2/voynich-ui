import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../src/style.css';
import voynichTheme from './voynich-theme';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      theme: voynichTheme,
    },
    backgrounds: {
      default: 'codex',
      values: [
        { name: 'codex', value: '#0d0905' },
        { name: 'vellum', value: '#eaddc5' },
        { name: 'ink', value: '#21120a' },
        { name: 'abyss', value: '#000000' },
      ],
    },
    a11y: {
      test: 'todo'
    },
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      // Skip decorator for Welcome page (it manages its own layout)
      const isWelcome = context?.title === 'Welcome';
      if (isWelcome) {
        return React.createElement(Story);
      }

      return React.createElement('div', {
        className: 'voynich-codex-root',
        style: {
          minHeight: '100%',
          width: '100%',
          padding: '2.5rem',
          background: 'radial-gradient(ellipse at 30% 20%, #120d08 0%, #0d0905 50%, #050302 100%)',
          color: '#eadbb6',
          fontFamily: "'IM Fell English', Georgia, serif",
          position: 'relative',
        },
      }, 
        // Parchment grain noise — subtle organic texture
        React.createElement('div', {
          style: {
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            zIndex: 0,
            mixBlendMode: 'overlay',
            opacity: 0.6,
          },
        }),
        // Corner vignette — stronger at edges for depth
        React.createElement('div', {
          style: {
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(5,3,2,0.35) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          },
        }),
        // Top-left corner ornament
        React.createElement('div', {
          style: {
            position: 'absolute',
            top: '0.6rem',
            left: '0.6rem',
            width: '20px',
            height: '20px',
            borderTop: '1px solid rgba(139,106,62,0.12)',
            borderLeft: '1px solid rgba(139,106,62,0.12)',
            pointerEvents: 'none',
            zIndex: 2,
          },
        }),
        // Bottom-right corner ornament
        React.createElement('div', {
          style: {
            position: 'absolute',
            bottom: '0.6rem',
            right: '0.6rem',
            width: '20px',
            height: '20px',
            borderBottom: '1px solid rgba(139,106,62,0.12)',
            borderRight: '1px solid rgba(139,106,62,0.12)',
            pointerEvents: 'none',
            zIndex: 2,
          },
        }),
        // Component name tag — top center
        context?.name && context.name !== 'Docs' ? React.createElement('div', {
          style: {
            position: 'absolute',
            top: '0.4rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.5rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#2a1d12',
            pointerEvents: 'none',
            zIndex: 2,
          },
        }, `${context?.title?.split('/').pop() || ''} › ${context?.name || ''}`) : null,
        // Content
        React.createElement('div', {
          style: { position: 'relative', zIndex: 1 },
        }, React.createElement(Story))
      );
    },
  ],
};

export default preview;