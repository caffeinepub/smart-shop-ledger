import React, { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'red' | 'green' | 'dark' | 'blue' | 'yellow' | 'orange';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  accentColor: AccentColor;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLORS: Record<AccentColor, { primary: string; primaryFg: string; ring: string }> = {
  red:    { primary: 'oklch(0.55 0.22 25)',   primaryFg: 'oklch(1 0 0)',    ring: 'oklch(0.55 0.22 25)' },
  green:  { primary: 'oklch(0.52 0.18 145)',  primaryFg: 'oklch(1 0 0)',    ring: 'oklch(0.52 0.18 145)' },
  dark:   { primary: 'oklch(0.30 0.02 260)',  primaryFg: 'oklch(0.95 0 0)', ring: 'oklch(0.30 0.02 260)' },
  blue:   { primary: 'oklch(0.52 0.20 250)',  primaryFg: 'oklch(1 0 0)',    ring: 'oklch(0.52 0.20 250)' },
  yellow: { primary: 'oklch(0.75 0.18 85)',   primaryFg: 'oklch(0.15 0 0)', ring: 'oklch(0.75 0.18 85)' },
  orange: { primary: 'oklch(0.65 0.20 50)',   primaryFg: 'oklch(1 0 0)',    ring: 'oklch(0.65 0.20 50)' },
};

function applyTheme(mode: ThemeMode, accent: AccentColor) {
  const root = document.documentElement;
  const colors = ACCENT_COLORS[accent];

  // Remove old classes
  root.classList.remove('light', 'dark');
  root.classList.add(mode);

  // Apply accent color CSS variables
  root.style.setProperty('--accent-primary', colors.primary);
  root.style.setProperty('--accent-primary-fg', colors.primaryFg);
  root.style.setProperty('--accent-ring', colors.ring);

  if (mode === 'light') {
    root.style.setProperty('--background', 'oklch(0.98 0.005 240)');
    root.style.setProperty('--foreground', 'oklch(0.12 0.02 240)');
    root.style.setProperty('--card', 'oklch(1 0 0)');
    root.style.setProperty('--card-foreground', 'oklch(0.12 0.02 240)');
    root.style.setProperty('--popover', 'oklch(1 0 0)');
    root.style.setProperty('--popover-foreground', 'oklch(0.12 0.02 240)');
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryFg);
    root.style.setProperty('--secondary', 'oklch(0.93 0.01 240)');
    root.style.setProperty('--secondary-foreground', 'oklch(0.20 0.02 240)');
    root.style.setProperty('--muted', 'oklch(0.93 0.01 240)');
    root.style.setProperty('--muted-foreground', 'oklch(0.45 0.02 240)');
    root.style.setProperty('--accent', 'oklch(0.93 0.01 240)');
    root.style.setProperty('--accent-foreground', 'oklch(0.20 0.02 240)');
    root.style.setProperty('--destructive', 'oklch(0.55 0.22 25)');
    root.style.setProperty('--destructive-foreground', 'oklch(1 0 0)');
    root.style.setProperty('--border', 'oklch(0.88 0.01 240)');
    root.style.setProperty('--input', 'oklch(0.88 0.01 240)');
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--nav-bg', 'oklch(1 0 0)');
    root.style.setProperty('--nav-border', 'oklch(0.88 0.01 240)');
    root.style.setProperty('--header-bg', 'oklch(0.15 0.03 240)');
    root.style.setProperty('--stat-card-bg', 'oklch(0.95 0.01 240)');
    root.style.setProperty('--stat-card-fg', 'oklch(0.12 0.02 240)');
    root.style.setProperty('--section-bg', 'oklch(1 0 0)');
    root.style.setProperty('--input-bg', 'oklch(0.95 0.01 240)');
  } else {
    root.style.setProperty('--background', 'oklch(0.12 0.02 240)');
    root.style.setProperty('--foreground', 'oklch(0.95 0.01 240)');
    root.style.setProperty('--card', 'oklch(0.18 0.02 240)');
    root.style.setProperty('--card-foreground', 'oklch(0.95 0.01 240)');
    root.style.setProperty('--popover', 'oklch(0.18 0.02 240)');
    root.style.setProperty('--popover-foreground', 'oklch(0.95 0.01 240)');
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryFg);
    root.style.setProperty('--secondary', 'oklch(0.22 0.02 240)');
    root.style.setProperty('--secondary-foreground', 'oklch(0.90 0.01 240)');
    root.style.setProperty('--muted', 'oklch(0.22 0.02 240)');
    root.style.setProperty('--muted-foreground', 'oklch(0.65 0.02 240)');
    root.style.setProperty('--accent', 'oklch(0.22 0.02 240)');
    root.style.setProperty('--accent-foreground', 'oklch(0.90 0.01 240)');
    root.style.setProperty('--destructive', 'oklch(0.55 0.22 25)');
    root.style.setProperty('--destructive-foreground', 'oklch(1 0 0)');
    root.style.setProperty('--border', 'oklch(0.28 0.02 240)');
    root.style.setProperty('--input', 'oklch(0.28 0.02 240)');
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--nav-bg', 'oklch(0.15 0.02 240)');
    root.style.setProperty('--nav-border', 'oklch(0.25 0.02 240)');
    root.style.setProperty('--header-bg', 'oklch(0.15 0.03 240)');
    root.style.setProperty('--stat-card-bg', 'oklch(0.20 0.02 240)');
    root.style.setProperty('--stat-card-fg', 'oklch(0.95 0.01 240)');
    root.style.setProperty('--section-bg', 'oklch(0.18 0.02 240)');
    root.style.setProperty('--input-bg', 'oklch(0.22 0.02 240)');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('themeMode') as ThemeMode) || 'dark';
    } catch { return 'dark'; }
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    try {
      return (localStorage.getItem('accentColor') as AccentColor) || 'green';
    } catch { return 'green'; }
  });

  useEffect(() => {
    applyTheme(mode, accentColor);
  }, [mode, accentColor]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    try { localStorage.setItem('themeMode', newMode); } catch {}
  };

  const toggleMode = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    try { localStorage.setItem('accentColor', color); } catch {}
  };

  return (
    <ThemeContext.Provider value={{ mode, accentColor, setMode, setAccentColor, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
