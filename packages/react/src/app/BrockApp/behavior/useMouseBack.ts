/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { nav } from '../../../navigation/nav';
import { MOUSE_BACK_BUTTON } from '../BrockApp.constants';

const useMouseBack = (): void => {
  useEffect(() => {
    const claim = (e: MouseEvent): void => {
      if (e.button === MOUSE_BACK_BUTTON) e.preventDefault();
    };
    const back = (e: MouseEvent): void => {
      if (e.button !== MOUSE_BACK_BUTTON) return;
      e.preventDefault();
      nav.back();
    };
    window.addEventListener('mousedown', claim);
    window.addEventListener('mouseup', back);
    return () => {
      window.removeEventListener('mousedown', claim);
      window.removeEventListener('mouseup', back);
    };
  }, []);
};

export { useMouseBack };
