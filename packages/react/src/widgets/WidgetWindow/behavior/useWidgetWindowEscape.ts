/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useEscapeStack } from '@drizztdourden08/tessera/primitives';
import { closeTopmost } from '../../../app/BrockApp/behavior/close-topmost';
import { shellTakesEscape } from '../../../escape/shell-takes-escape';

const useWidgetWindowEscape = (): void => {
  const escapes = useEscapeStack();
  useEffect(() => {
    const root = document.documentElement;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && shellTakesEscape(e, escapes)) closeTopmost(e, null);
    };
    root.addEventListener('keydown', handler);
    return () => root.removeEventListener('keydown', handler);
  }, [escapes]);
};

export { useWidgetWindowEscape };
