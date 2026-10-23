/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';

const useAltKey = (onAlt: () => void): void => {
  const latest = useRef(onAlt);
  useEffect(() => {
    latest.current = onAlt;
  });
  useEffect(() => {
    let armed = false;
    const disarm = (): void => {
      armed = false;
    };
    const down = (event: KeyboardEvent): void => {
      if (event.key !== 'Alt') armed = false;
      else if (!event.repeat) armed = !event.ctrlKey && !event.shiftKey && !event.metaKey;
    };
    const up = (event: KeyboardEvent): void => {
      if (event.key !== 'Alt' || !armed) return;
      armed = false;
      event.preventDefault();
      latest.current();
    };
    window.addEventListener('keydown', down, true);
    window.addEventListener('keyup', up, true);
    window.addEventListener('pointerdown', disarm, true);
    return () => {
      window.removeEventListener('keydown', down, true);
      window.removeEventListener('keyup', up, true);
      window.removeEventListener('pointerdown', disarm, true);
    };
  }, []);
};

export { useAltKey };
