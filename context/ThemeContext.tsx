'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type ThemeId =
  | 'cyan'
  | 'emerald'
  | 'monochrome'
  | 'violet'
  | 'amber'
  | 'tokyo'
  | 'glacier'
  | 'rust'
  | 'synthwave'
  | 'forest'
  | 'braun'
  | 'swiss'
  | 'slate'
  | 'carbon'
  | 'tactical'
  | 'dracula'
  | 'nord'
  | 'gruvbox'
  | 'catppuccin'
  | 'solarized'
  | 'matrix'
  | 'cyberpunk'
  | 'bloodmoon'
  | 'nebula'
  | 'gold'
  | 'carrera'
  | 'yozakura'
  | 'abyss';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  dotColor: string;
  bg: string;
  cardBg: string;
  border: string;
  primary: string;       // HEX for Three.js shaders & styles
  primaryHover: string;
  secondary: string;     // Complementary shade for shaders & gradients
  accentText: string;    // Tailwind text class or HEX
  buttonBg: string;      // Tailwind bg class or HEX
  buttonText: string;
}

export const themes: Record<ThemeId, ThemeConfig> = {
  // ── Core Presets ───────────────────────────────────────────────────────────
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan (Default)',
    dotColor: '#00F5D4',
    bg: '#06080D',
    cardBg: 'rgba(10, 15, 25, 0.7)',
    border: 'rgba(0, 245, 212, 0.15)',
    primary: '#00F5D4',
    primaryHover: '#00D1B2',
    secondary: '#4FACFE',
    accentText: 'text-cyan-400',
    buttonBg: 'bg-cyan-400',
    buttonText: 'text-black',
  },
  emerald: {
    id: 'emerald',
    name: 'Obsidian Emerald',
    dotColor: '#10B981',
    bg: '#050A08',
    cardBg: 'rgba(8, 20, 15, 0.7)',
    border: 'rgba(16, 185, 129, 0.15)',
    primary: '#10B981',
    primaryHover: '#059669',
    secondary: '#34D399',
    accentText: 'text-emerald-400',
    buttonBg: 'bg-emerald-400',
    buttonText: 'text-black',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Titanium Monochrome',
    dotColor: '#FFFFFF',
    bg: '#000000',
    cardBg: 'rgba(18, 18, 20, 0.75)',
    border: 'rgba(255, 255, 255, 0.12)',
    primary: '#FFFFFF',
    primaryHover: '#E4E4E7',
    secondary: '#9CA3AF',
    accentText: 'text-white',
    buttonBg: 'bg-white',
    buttonText: 'text-black',
  },
  violet: {
    id: 'violet',
    name: 'Deep Space Violet',
    dotColor: '#8B5CF6',
    bg: '#080814',
    cardBg: 'rgba(15, 14, 30, 0.7)',
    border: 'rgba(139, 92, 246, 0.2)',
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    secondary: '#C084FC',
    accentText: 'text-purple-400',
    buttonBg: 'bg-purple-500',
    buttonText: 'text-white',
  },
  amber: {
    id: 'amber',
    name: 'Warm Ember',
    dotColor: '#F59E0B',
    bg: '#0C0B0A',
    cardBg: 'rgba(24, 20, 16, 0.7)',
    border: 'rgba(245, 158, 11, 0.2)',
    primary: '#F59E0B',
    primaryHover: '#D97706',
    secondary: '#FBBF24',
    accentText: 'text-amber-400',
    buttonBg: 'bg-amber-400',
    buttonText: 'text-black',
  },

  // ── Cyberpunk & Neon Series ────────────────────────────────────────────────
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo Cyberpunk',
    dotColor: '#FF007F',
    bg: '#0B0C16',
    cardBg: 'rgba(18, 16, 35, 0.7)',
    border: 'rgba(255, 0, 127, 0.2)',
    primary: '#FF007F',
    primaryHover: '#D6006B',
    secondary: '#A855F7',
    accentText: 'text-pink-500',
    buttonBg: 'bg-pink-500',
    buttonText: 'text-white',
  },
  glacier: {
    id: 'glacier',
    name: 'Nordic Glacier',
    dotColor: '#38BDF8',
    bg: '#070C12',
    cardBg: 'rgba(12, 22, 34, 0.7)',
    border: 'rgba(56, 189, 248, 0.18)',
    primary: '#38BDF8',
    primaryHover: '#0284C7',
    secondary: '#7DD3FC',
    accentText: 'text-sky-400',
    buttonBg: 'bg-sky-400',
    buttonText: 'text-black',
  },
  rust: {
    id: 'rust',
    name: 'Rust Oxide',
    dotColor: '#FF5722',
    bg: '#0E0806',
    cardBg: 'rgba(26, 16, 12, 0.7)',
    border: 'rgba(255, 87, 34, 0.2)',
    primary: '#FF5722',
    primaryHover: '#E64A19',
    secondary: '#FF8A65',
    accentText: 'text-orange-500',
    buttonBg: 'bg-orange-500',
    buttonText: 'text-white',
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    dotColor: '#FB7185',
    bg: '#0A0612',
    cardBg: 'rgba(24, 12, 32, 0.7)',
    border: 'rgba(251, 113, 133, 0.2)',
    primary: '#FB7185',
    primaryHover: '#E11D48',
    secondary: '#C084FC',
    accentText: 'text-rose-400',
    buttonBg: 'bg-rose-500',
    buttonText: 'text-white',
  },
  forest: {
    id: 'forest',
    name: 'Forest Matrix',
    dotColor: '#4ADE80',
    bg: '#040D08',
    cardBg: 'rgba(6, 24, 14, 0.7)',
    border: 'rgba(74, 222, 128, 0.18)',
    primary: '#4ADE80',
    primaryHover: '#22C55E',
    secondary: '#10B981',
    accentText: 'text-green-400',
    buttonBg: 'bg-green-400',
    buttonText: 'text-black',
  },

  // ── Bauhaus, Editorial & Industrial ────────────────────────────────────────
  braun: {
    id: 'braun',
    name: 'Industrial Bauhaus (Braun)',
    dotColor: '#D97706',
    bg: '#121110',
    cardBg: 'rgba(26, 24, 22, 0.75)',
    border: 'rgba(217, 119, 6, 0.18)',
    primary: '#D97706',
    primaryHover: '#B45309',
    secondary: '#F59E0B',
    accentText: 'text-amber-500',
    buttonBg: 'bg-[#D97706]',
    buttonText: 'text-black',
  },
  swiss: {
    id: 'swiss',
    name: 'Swiss Monolith (Editorial)',
    dotColor: '#E4E4E7',
    bg: '#0E0E10',
    cardBg: 'rgba(22, 22, 26, 0.75)',
    border: 'rgba(228, 228, 231, 0.15)',
    primary: '#E4E4E7',
    primaryHover: '#FFFFFF',
    secondary: '#A1A1AA',
    accentText: 'text-zinc-200',
    buttonBg: 'bg-zinc-200',
    buttonText: 'text-black',
  },
  slate: {
    id: 'slate',
    name: 'Maritime Slate (Linear)',
    dotColor: '#60A5FA',
    bg: '#0D1117',
    cardBg: 'rgba(19, 26, 38, 0.75)',
    border: 'rgba(96, 165, 250, 0.15)',
    primary: '#60A5FA',
    primaryHover: '#3B82F6',
    secondary: '#93C5FD',
    accentText: 'text-blue-400',
    buttonBg: 'bg-blue-500',
    buttonText: 'text-white',
  },
  carbon: {
    id: 'carbon',
    name: 'Carbon Ochre (Aerospace)',
    dotColor: '#EAB308',
    bg: '#141416',
    cardBg: 'rgba(28, 28, 32, 0.75)',
    border: 'rgba(234, 179, 8, 0.18)',
    primary: '#EAB308',
    primaryHover: '#CA8A04',
    secondary: '#FACC15',
    accentText: 'text-yellow-400',
    buttonBg: 'bg-yellow-500',
    buttonText: 'text-black',
  },
  tactical: {
    id: 'tactical',
    name: 'Tactical Sage (Field Tech)',
    dotColor: '#A3B18A',
    bg: '#0E100D',
    cardBg: 'rgba(20, 26, 20, 0.75)',
    border: 'rgba(163, 177, 138, 0.2)',
    primary: '#A3B18A',
    primaryHover: '#588157',
    secondary: '#3A5A40',
    accentText: 'text-[#A3B18A]',
    buttonBg: 'bg-[#A3B18A]',
    buttonText: 'text-black',
  },

  // ── Iconic Developer & Sci-Fi Collections ──────────────────────────────────
  dracula: {
    id: 'dracula',
    name: 'Dracula Vampire',
    dotColor: '#BD93F9',
    bg: '#0D0C18',
    cardBg: 'rgba(20, 18, 36, 0.75)',
    border: 'rgba(189, 147, 249, 0.2)',
    primary: '#BD93F9',
    primaryHover: '#A770F6',
    secondary: '#FF79C6',
    accentText: 'text-purple-400',
    buttonBg: 'bg-[#BD93F9]',
    buttonText: 'text-black',
  },
  nord: {
    id: 'nord',
    name: 'Nord Arctic Frost',
    dotColor: '#88C0D0',
    bg: '#090D14',
    cardBg: 'rgba(15, 23, 36, 0.75)',
    border: 'rgba(136, 192, 208, 0.18)',
    primary: '#88C0D0',
    primaryHover: '#81A1C1',
    secondary: '#5E81AC',
    accentText: 'text-cyan-300',
    buttonBg: 'bg-[#88C0D0]',
    buttonText: 'text-black',
  },
  gruvbox: {
    id: 'gruvbox',
    name: 'Gruvbox Retro Dark',
    dotColor: '#FABD2F',
    bg: '#141210',
    cardBg: 'rgba(28, 24, 20, 0.75)',
    border: 'rgba(250, 189, 47, 0.18)',
    primary: '#FABD2F',
    primaryHover: '#FE8019',
    secondary: '#B8BB26',
    accentText: 'text-amber-400',
    buttonBg: 'bg-[#FABD2F]',
    buttonText: 'text-black',
  },
  catppuccin: {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    dotColor: '#F5C2E7',
    bg: '#11111B',
    cardBg: 'rgba(24, 24, 37, 0.75)',
    border: 'rgba(245, 194, 231, 0.18)',
    primary: '#F5C2E7',
    primaryHover: '#F2CDCD',
    secondary: '#CBA6F7',
    accentText: 'text-pink-300',
    buttonBg: 'bg-[#F5C2E7]',
    buttonText: 'text-black',
  },
  solarized: {
    id: 'solarized',
    name: 'Solarized Cyber',
    dotColor: '#268BD2',
    bg: '#00141A',
    cardBg: 'rgba(0, 33, 43, 0.75)',
    border: 'rgba(38, 139, 210, 0.2)',
    primary: '#268BD2',
    primaryHover: '#2AA198',
    secondary: '#6C71C4',
    accentText: 'text-blue-400',
    buttonBg: 'bg-[#268BD2]',
    buttonText: 'text-white',
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Phosphor',
    dotColor: '#00FF41',
    bg: '#020B04',
    cardBg: 'rgba(4, 20, 8, 0.75)',
    border: 'rgba(0, 255, 65, 0.22)',
    primary: '#00FF41',
    primaryHover: '#00CC33',
    secondary: '#10B981',
    accentText: 'text-green-400',
    buttonBg: 'bg-[#00FF41]',
    buttonText: 'text-black',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    dotColor: '#FCEE0A',
    bg: '#08090C',
    cardBg: 'rgba(20, 22, 28, 0.75)',
    border: 'rgba(252, 238, 10, 0.22)',
    primary: '#FCEE0A',
    primaryHover: '#E5D600',
    secondary: '#00F0FF',
    accentText: 'text-yellow-300',
    buttonBg: 'bg-[#FCEE0A]',
    buttonText: 'text-black',
  },
  bloodmoon: {
    id: 'bloodmoon',
    name: 'Blood Moon Crimson',
    dotColor: '#FF1E56',
    bg: '#100508',
    cardBg: 'rgba(26, 10, 14, 0.75)',
    border: 'rgba(255, 30, 86, 0.22)',
    primary: '#FF1E56',
    primaryHover: '#E00B41',
    secondary: '#FF5722',
    accentText: 'text-rose-500',
    buttonBg: 'bg-[#FF1E56]',
    buttonText: 'text-white',
  },
  nebula: {
    id: 'nebula',
    name: 'Cosmic Nebula',
    dotColor: '#D946EF',
    bg: '#070514',
    cardBg: 'rgba(18, 12, 36, 0.75)',
    border: 'rgba(217, 70, 239, 0.22)',
    primary: '#D946EF',
    primaryHover: '#C026D3',
    secondary: '#6366F1',
    accentText: 'text-fuchsia-400',
    buttonBg: 'bg-fuchsia-500',
    buttonText: 'text-white',
  },
  gold: {
    id: 'gold',
    name: 'Obsidian 24K Gold',
    dotColor: '#FFD700',
    bg: '#0A0908',
    cardBg: 'rgba(24, 22, 18, 0.75)',
    border: 'rgba(255, 215, 0, 0.2)',
    primary: '#FFD700',
    primaryHover: '#E5C100',
    secondary: '#D4AF37',
    accentText: 'text-yellow-400',
    buttonBg: 'bg-[#FFD700]',
    buttonText: 'text-black',
  },
  carrera: {
    id: 'carrera',
    name: 'Carrera Telemetry',
    dotColor: '#E11D48',
    bg: '#0B0C0E',
    cardBg: 'rgba(20, 22, 26, 0.75)',
    border: 'rgba(225, 29, 72, 0.2)',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    secondary: '#94A3B8',
    accentText: 'text-red-500',
    buttonBg: 'bg-red-600',
    buttonText: 'text-white',
  },
  yozakura: {
    id: 'yozakura',
    name: 'Kyoto Yozakura',
    dotColor: '#F472B6',
    bg: '#0F0814',
    cardBg: 'rgba(26, 14, 32, 0.75)',
    border: 'rgba(244, 114, 182, 0.2)',
    primary: '#F472B6',
    primaryHover: '#EC4899',
    secondary: '#818CF8',
    accentText: 'text-pink-400',
    buttonBg: 'bg-pink-400',
    buttonText: 'text-black',
  },
  abyss: {
    id: 'abyss',
    name: 'Deep Abyss Trench',
    dotColor: '#06B6D4',
    bg: '#040810',
    cardBg: 'rgba(8, 18, 30, 0.75)',
    border: 'rgba(6, 182, 212, 0.2)',
    primary: '#06B6D4',
    primaryHover: '#0891B2',
    secondary: '#3B82F6',
    accentText: 'text-cyan-400',
    buttonBg: 'bg-cyan-500',
    buttonText: 'text-black',
  },
};

interface ThemeContextType {
  theme: ThemeConfig;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  themesList: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio-theme-v1';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('cyan');
  const [mounted, setMounted] = useState(false);

  // Read saved theme from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (saved && themes[saved]) {
        setThemeId(saved);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setMounted(true);
  }, []);

  // Apply theme tokens to DOM root when themeId changes
  useEffect(() => {
    const active = themes[themeId] || themes.cyan;
    const root = document.documentElement;

    root.dataset.theme = active.id;
    root.style.setProperty('--bg', active.bg);
    root.style.setProperty('--card-bg', active.cardBg);
    root.style.setProperty('--border', active.border);
    root.style.setProperty('--cyan', active.primary);
    root.style.setProperty('--cyan-dim', active.primaryHover);
    root.style.setProperty('--accent', active.primary);
    root.style.setProperty('--theme-dot', active.dotColor);
    root.style.backgroundColor = active.bg;

    if (document.body) {
      document.body.style.backgroundColor = 'transparent';
    }

    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, active.id);
      } catch {
        // Ignore storage errors
      }
    }
  }, [themeId, mounted]);

  const value = useMemo(
    () => ({
      theme: themes[themeId] || themes.cyan,
      themeId,
      setTheme: (id: ThemeId) => {
        if (themes[id]) {
          setThemeId(id);
        }
      },
      themesList: Object.values(themes),
    }),
    [themeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
