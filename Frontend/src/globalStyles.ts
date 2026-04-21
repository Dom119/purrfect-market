import { createGlobalStyle } from 'styled-components'
import { theme } from './theme'

export const GlobalStyles = createGlobalStyle`
  /* ── Light theme (default) ─────────────────────────────── */
  :root {
    --color-primary:       #F2A365;
    --color-primary-dark:  #e08d4a;
    --color-navy:          #1a1a2e;
    --color-charcoal:      #2d2d44;
    --color-grey:          #6b7280;
    --color-grey-light:    #9ca3af;
    --color-grey-bg:       #f8f9fa;
    --color-off-white:     #fafafa;
    --color-white:         #ffffff;
    --color-teal:          #5bc0be;
    --color-teal-light:    #7dd3d1;
    --color-yellow:        #f4d35e;
    --color-purple:        #9b8ec2;
    --color-green:         #6bcb77;
    --color-blue:          #4d96ff;
    --color-gold:          #b89b6a;
    --color-border:        #e5e7eb;
    --color-body-bg:       #ffffff;
    --color-body-text:     #2d2d44;

    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
  }

  /* ── Dark theme ─────────────────────────────────────────── */
  [data-theme="dark"] {
    --color-primary:       #c4622d;
    --color-primary-dark:  #d9744a;
    --color-navy:          #f0ebe1;
    --color-charcoal:      #d4cfc6;
    --color-grey:          #8a8078;
    --color-grey-light:    #5a524c;
    --color-grey-bg:       #171310;
    --color-off-white:     #1a1714;
    --color-white:         #1c1814;
    --color-teal:          #8aaa7c;
    --color-teal-light:    #9dba91;
    --color-yellow:        #c4a84e;
    --color-purple:        #a99fd4;
    --color-green:         #6bcb77;
    --color-blue:          #6aabff;
    --color-gold:          #b89b6a;
    --color-border:        rgba(255,255,255,0.08);
    --color-body-bg:       #0e0c0a;
    --color-body-text:     #f0ebe1;

    --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.4);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.5);
  }

  /* ── Reset & base ───────────────────────────────────────── */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.fonts.body};
    color: var(--color-body-text);
    background: var(--color-body-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`
