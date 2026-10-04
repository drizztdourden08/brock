/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { closeTopmost } from '../../../app/BrockApp/behavior/close-topmost';
import { useStandardEscapeLayers } from '../../../app/BrockApp/behavior/useStandardEscapeLayers';

const useWidgetWindowEscape = (): void => {
  useStandardEscapeLayers();
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') closeTopmost(e, null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
};

export { useWidgetWindowEscape };
