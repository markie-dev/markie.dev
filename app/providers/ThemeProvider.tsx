'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme | null
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: null,
  toggleTheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme
    setTheme(stored || defaultTheme)
    setMounted(true)
  }, [defaultTheme])

  useEffect(() => {
    if (!mounted || !theme) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (mounted) {
      const timeoutId = setTimeout(() => {
        document.documentElement.classList.add('loaded');
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [mounted]);

  const toggleTheme = () => {
    if (!theme) return
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeProviderContext.Provider 
      value={{ 
        theme: mounted ? theme : null, 
        toggleTheme 
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context as { theme: Theme; toggleTheme: () => void }
}