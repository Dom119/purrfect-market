export const theme = {
  colors: {
    primary: '#F2A365',
    primaryDark: '#e08d4a',
    navy: '#1a1a2e',
    charcoal: '#2d2d44',
    grey: '#6b7280',
    greyLight: '#9ca3af',
    greyBg: '#f8f9fa',
    offWhite: '#fafafa',
    white: '#ffffff',
    teal: '#5bc0be',
    tealLight: '#7dd3d1',
    yellow: '#f4d35e',
    purple: '#9b8ec2',
    green: '#6bcb77',
    blue: '#4d96ff',
  },
  fonts: {
    body: '"Poppins", system-ui, -apple-system, sans-serif',
    heading: '"Poppins", system-ui, -apple-system, sans-serif',
  },
  spacing: {
    section: '5rem',
    container: '1200px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 25px rgba(0,0,0,0.1)',
  },
} as const
