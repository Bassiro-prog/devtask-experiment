import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'devtask-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light';
}

export function useTheme() {
  // Escolha manual (salva) tem prioridade; sem ela, segue o tema do sistema.
  const [manualTheme, setManualTheme] = useState<Theme | null>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const theme = manualTheme ?? systemTheme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (manualTheme || !window.matchMedia) return;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) =>
      setSystemTheme(event.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [manualTheme]);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setManualTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage indisponível (ex.: modo privado); o tema só não será lembrado.
    }
  };

  return { theme, toggleTheme };
}
