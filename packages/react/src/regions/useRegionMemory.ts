/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { rememberFocus } from './remember-focus';

const useRegionMemory = (): void => {
  useEffect(() => {
    const onFocusIn = (event: FocusEvent): void => rememberFocus(event.target);
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);
};

export { useRegionMemory };
