import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { userSettingsService } from '../services/userSettingsService'

type ThemeContextValue = {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : false
  })

  // 1. Initial local sync and listener
  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // 2. Sync with database when user logs in
  useEffect(() => {
    if (!user) return

    const syncTheme = async () => {
      try {
        const settings = await userSettingsService.getForUser(user.id)
        if (settings?.theme) {
          setIsDark(settings.theme === 'dark')
        }
      } catch (err) {
        console.error('Failed to sync theme from DB:', err)
      }
    }

    void syncTheme()
  }, [user])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    
    // Persist to DB if user is logged in
    if (user) {
      void userSettingsService.getForUser(user.id).then(settings => {
        void userSettingsService.upsert(user.id, {
          grossIncome: settings?.gross_income ?? null,
          redLineAmount: settings?.red_line_amount ?? null,
          currency: settings?.currency ?? 'USD',
          theme: next ? 'dark' : 'light'
        })
      })
    }
  }

  const setTheme = (dark: boolean) => {
    setIsDark(dark)
    if (user) {
      void userSettingsService.getForUser(user.id).then(settings => {
        void userSettingsService.upsert(user.id, {
          grossIncome: settings?.gross_income ?? null,
          red_line_amount: settings?.red_line_amount ?? null,
          currency: settings?.currency ?? 'USD',
          theme: dark ? 'dark' : 'light'
        } as any)
      })
    }
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}

