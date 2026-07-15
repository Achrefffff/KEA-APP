/**
 * Kea Shop Mobile App Theme
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#282828',
    textSecondary: '#666666',
    background: '#f5f5f5',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e0e0e0',
    primary: '#000000',
    primaryText: '#ffffff',
    success: '#d1fae5',
    successText: '#065f46',
    error: '#b42318',
    border: '#dddddd',
  },
  dark: {
    text: '#282828',
    textSecondary: '#666666',
    background: '#f5f5f5',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e0e0e0',
    primary: '#000000',
    primaryText: '#ffffff',
    success: '#d1fae5',
    successText: '#065f46',
    error: '#b42318',
    border: '#dddddd',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 4,
  one: 8,
  two: 16,
  three: 24,
  four: 32,
  five: 40,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
