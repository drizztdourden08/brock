/* @layer renderer-shell @kind hook */
import { useCallback, useMemo, useRef } from 'react';
import type { PressFlag } from '../ProfilesPanel.type';

const usePressFlag = (): PressFlag => {
  const pressed = useRef(false);
  const handlers = useMemo(() => ({
    onClickCapture: () => { pressed.current = true; },
    onClick: () => { pressed.current = false; },
    onKeyDownCapture: () => { pressed.current = false; },
  }), []);
  const take = useCallback(() => {
    const was = pressed.current;
    pressed.current = false;
    return was;
  }, []);
  return { handlers, take };
};

export { usePressFlag };
