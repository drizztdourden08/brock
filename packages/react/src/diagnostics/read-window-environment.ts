/* @layer renderer-shell @kind logic */
import type { WindowEnvironment } from './diagnostics.type';

const readWindowEnvironment = (): WindowEnvironment | null => {
  if (typeof window === 'undefined') return null;
  const { screen } = window;
  return {
    screenWidth: screen.width,
    screenHeight: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    colorDepth: screen.colorDepth,
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
};

export { readWindowEnvironment };
