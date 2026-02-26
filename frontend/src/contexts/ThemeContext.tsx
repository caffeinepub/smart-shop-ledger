import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeColor = 'red' | 'green' | 'black' | 'purple' | 'orange' | 'teal';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  isDark: boolean;
  toggleMode: () => void;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  color: 'green',
  isDark: false,
  toggleMode: () => {},
  setColor: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved === 'true') return 'dark';
      if (saved === 'false') return 'light';
    } catch {}
    return 'light';
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    try {
      const saved = localStorage.getItem('themeColor');
      if (saved && ['red', 'green', 'black', 'purple', 'orange', 'teal'].includes(saved)) {
        return saved as ThemeColor;
      }
    } catch {}
    return 'green';
  });

  const isDark = mode === 'dark';

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    } catch {}
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('themeColor', color);
    } catch {}
    applyThemeColor(color, isDark);
  }, [color, isDark]);

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('darkMode', next === 'dark' ? 'true' : 'false');
      } catch {}
      return next;
    });
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    try {
      localStorage.setItem('themeColor', newColor);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ mode, color, isDark, toggleMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

function applyThemeColor(color: ThemeColor, isDark: boolean) {
  const root = document.documentElement;
  const themes: Record<ThemeColor, { primary: string; secondary: string; accent: string }> = {
    green: {
      primary: isDark ? 'oklch(0.75 0.18 145)' : 'oklch(0.45 0.18 145)',
      secondary: isDark ? 'oklch(0.35 0.08 145)' : 'oklch(0.92 0.05 145)',
      accent: isDark ? 'oklch(0.65 0.15 145)' : 'oklch(0.55 0.15 145)',
    },
    red: {
      primary: isDark ? 'oklch(0.70 0.20 25)' : 'oklch(0.50 0.22 25)',
      secondary: isDark ? 'oklch(0.30 0.08 25)' : 'oklch(0.93 0.04 25)',
      accent: isDark ? 'oklch(0.60 0.18 25)' : 'oklch(0.55 0.18 25)',
    },
    black: {
      primary: isDark ? 'oklch(0.80 0.00 0)' : 'oklch(0.20 0.00 0)',
      secondary: isDark ? 'oklch(0.25 0.00 0)' : 'oklch(0.90 0.00 0)',
      accent: isDark ? 'oklch(0.60 0.00 0)' : 'oklch(0.40 0.00 0)',
    },
    purple: {
      primary: isDark ? 'oklch(0.72 0.20 290)' : 'oklch(0.50 0.22 290)',
      secondary: isDark ? 'oklch(0.30 0.08 290)' : 'oklch(0.93 0.04 290)',
      accent: isDark ? 'oklch(0.62 0.18 290)' : 'oklch(0.55 0.18 290)',
    },
    orange: {
      primary: isDark ? 'oklch(0.75 0.18 55)' : 'oklch(0.55 0.20 55)',
      secondary: isDark ? 'oklch(0.32 0.08 55)' : 'oklch(0.93 0.04 55)',
      accent: isDark ? 'oklch(0.65 0.16 55)' : 'oklch(0.58 0.16 55)',
    },
    teal: {
      primary: isDark ? 'oklch(0.72 0.16 185)' : 'oklch(0.48 0.18 185)',
      secondary: isDark ? 'oklch(0.30 0.07 185)' : 'oklch(0.92 0.04 185)',
      accent: isDark ? 'oklch(0.62 0.14 185)' : 'oklch(0.52 0.14 185)',
    },
  };

  const t = themes[color] || themes.green;
  root.style.setProperty('--theme-primary', t.primary);
  root.style.setProperty('--theme-secondary', t.secondary);
  root.style.setProperty('--theme-accent', t.accent);
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
