/**
 * All color values are CSS custom-property references so that a single
 * [data-theme="dark"] attribute on <html> flips the whole palette without
 * touching any styled-component.
 *
 * Light-mode variable values live in globalStyles :root block.
 * Dark-mode overrides live in globalStyles [data-theme="dark"] block.
 */
export const theme = {
  colors: {
    primary:      'var(--color-primary)',
    primaryDark:  'var(--color-primary-dark)',
    navy:         'var(--color-navy)',        // heading text
    charcoal:     'var(--color-charcoal)',    // body text
    grey:         'var(--color-grey)',        // muted text
    greyLight:    'var(--color-grey-light)',  // very muted / placeholders
    greyBg:       'var(--color-grey-bg)',     // section / table-header bg
    offWhite:     'var(--color-off-white)',   // page-level bg
    white:        'var(--color-white)',       // card / input surface
    teal:         'var(--color-teal)',
    tealLight:    'var(--color-teal-light)',
    yellow:       'var(--color-yellow)',
    purple:       'var(--color-purple)',
    green:        'var(--color-green)',
    blue:         'var(--color-blue)',
    gold:         'var(--color-gold)',
    border:       'var(--color-border)',
    // Fixed tokens — never change between themes
    alwaysDark:   '#1a1a2e',
    alwaysDarkText: '#ffffff',
  },
  fonts: {
    body:    '"Poppins", system-ui, -apple-system, sans-serif',
    heading: '"Poppins", system-ui, -apple-system, sans-serif',
    display: '"Cormorant Garamond", Georgia, serif',
    sans:    '"DM Sans", system-ui, sans-serif',
  },
  spacing: {
    section:   '5rem',
    container: '1200px',
  },
  radius: {
    sm:   '8px',
    md:   '12px',
    lg:   '16px',
    xl:   '24px',
    full: '9999px',
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },
} as const
