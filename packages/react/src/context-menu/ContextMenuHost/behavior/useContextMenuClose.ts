/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { closeContextMenu } from '../../close-context-menu';
import { MENU_ROLE_SELECTOR } from '../../context-menu.constants';

const insideMenu = (target: EventTarget | null): boolean => target instanceof Element && target.closest(MENU_ROLE_SELECTOR) !== null;

const useContextMenuClose = (open: boolean): void => {
  useEffect(() => {
    if (!open) return undefined;
    const outside = (event: Event): void => {
      if (!insideMenu(event.target)) closeContextMenu();
    };
    const always = (): void => closeContextMenu();
    const stopRoute = useNavigationStore.subscribe((state, before) => {
      if (state.active !== before.active) closeContextMenu();
    });
    window.addEventListener('scroll', outside, true);
    window.addEventListener('wheel', outside, { capture: true, passive: true });
    window.addEventListener('focusin', outside);
    window.addEventListener('resize', always);
    window.addEventListener('blur', always);
    return () => {
      stopRoute();
      window.removeEventListener('scroll', outside, true);
      window.removeEventListener('wheel', outside, true);
      window.removeEventListener('focusin', outside);
      window.removeEventListener('resize', always);
      window.removeEventListener('blur', always);
    };
  }, [open]);
};

export { useContextMenuClose };
