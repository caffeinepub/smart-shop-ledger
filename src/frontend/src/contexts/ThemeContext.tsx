import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeColor = 'red' | 'green' | 'black';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  console.log('[ThemeProvider] Initializing at', new Date().toISOString());

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        console.log('[ThemeProvider] Loaded theme from localStorage:', savedTheme);
        return savedTheme;
      }
      console.log('[ThemeProvider] Using default theme: light');
      return 'light';
    } catch (error) {
      console.error('[ThemeProvider] Failed to load theme from localStorage:', error);
      return 'light';
    }
  });

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    try {
      const savedColor = localStorage.getItem('themeColor') as ThemeColor;
      if (savedColor && ['red', 'green', 'black'].includes(savedColor)) {
        console.log('[ThemeProvider] Loaded themeColor from localStorage:', savedColor);
        return savedColor;
      }
      console.log('[ThemeProvider] Using default themeColor: red');
      return 'red';
    } catch (error) {
      console.error('[ThemeProvider] Failed to load themeColor from localStorage:', error);
      return 'red';
    }
  });

  useEffect(() => {
    try {
      console.log('[ThemeProvider] Applying theme to DOM:', theme);
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    } catch (error) {
      console.error('[ThemeProvider] Failed to apply theme to DOM:', error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      console.log('[ThemeProvider] Applying themeColor to DOM:', themeColor);
      const root = document.documentElement;
      root.setAttribute('data-theme-color', themeColor);
      applyThemeColor(themeColor);
    } catch (error) {
      console.error('[ThemeProvider] Failed to apply themeColor to DOM:', error);
    }
  }, [themeColor]);

  const applyThemeColor = (color: ThemeColor) => {
    const root = document.documentElement;
    
    // Bangladesh flag inspired colors
    const colorSchemes = {
      red: {
        primary: '0.55 0.25 15', // #F42A41 in OKLCH
        primaryForeground: '1 0 0',
      },
      green: {
        primary: '0.40 0.15 165', // #006A4E in OKLCH
        primaryForeground: '1 0 0',
      },
      black: {
        primary: '0.20 0 0', // Near black
        primaryForeground: '1 0 0',
      },
    };

    const scheme = colorSchemes[color];
    root.style.setProperty('--primary', scheme.primary);
    root.style.setProperty('--primary-foreground', scheme.primaryForeground);
  };

  const setTheme = (newTheme: Theme) => {
    console.log('[ThemeProvider] Setting theme to:', newTheme);
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('[ThemeProvider] Failed to save theme to localStorage:', error);
    }
  };

  const setThemeColor = (color: ThemeColor) => {
    console.log('[ThemeProvider] Setting themeColor to:', color);
    setThemeColorState(color);
    try {
      localStorage.setItem('themeColor', color);
    } catch (error) {
      console.error('[ThemeProvider] Failed to save themeColor to localStorage:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
