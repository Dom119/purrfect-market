import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type ColorTheme = 'light' | 'dark'

interface ThemeContextValue {
  colorTheme: ColorTheme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  colorTheme: 'light',
  toggleTheme: () => {},
})

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem('color-theme') as ColorTheme | null
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme)
    localStorage.setItem('color-theme', colorTheme)
  }, [colorTheme])

  const toggleTheme = () => setColorTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ colorTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useColorTheme() {
  return useContext(ThemeContext)
}
