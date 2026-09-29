/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { escapeLayers } from '../../../escape/escape-layers';
import { usePlatform } from '../../../platform/usePlatform';

const useTitleBar = (menuRef: RefObject<HTMLElement | null>) => {
  const { window: win } = usePlatform();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    void win.isMaximized().then(setIsMaximized);
    return win.onMaximizedChange(setIsMaximized);
  }, [win]);

  useEffect(() => {
    void win.isFullscreen().then(setIsFullscreen);
    return win.onFullscreenChange(setIsFullscreen);
  }, [win]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    return escapeLayers.add({ isOpen: () => true, close: () => setMenuOpen(false) });
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('.dropdown-menu')) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, menuRef]);

  return {
    isMaximized,
    isFullscreen,
    menuOpen,
    toggleMenu: () => setMenuOpen((open) => !open),
    closeMenu: () => setMenuOpen(false),
  };
};

export { useTitleBar };
