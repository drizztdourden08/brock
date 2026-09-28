/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { hostApi } from '../../../host/host-api';

const useShellReady = (settled: boolean): void => {
  const signalled = useRef(false);

  useEffect(() => {
    if (signalled.current || !settled) return;
    signalled.current = true;
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('booting');
      requestAnimationFrame(() => hostApi()?.shellReady());
    });
  }, [settled]);
};

export { useShellReady };
