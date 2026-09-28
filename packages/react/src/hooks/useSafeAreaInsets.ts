/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { SAFE_AREA_EVENT, ZERO } from './safe-area-insets.constants';
import type { SafeAreaInsets } from './safe-area-insets.type';

const readInsets = (): SafeAreaInsets => {
  const style = getComputedStyle(document.documentElement);
  const px = (name: string): number => parseFloat(style.getPropertyValue(name)) || 0;
  const top = px('--sai-top');
  const right = px('--sai-right');
  const bottom = px('--sai-bottom');
  const left = px('--sai-left');
  return { top, right, bottom, left, hasNotch: Math.max(top, right, bottom, left) > 0 };
};

const useSafeAreaInsets = (): SafeAreaInsets => {
  const [insets, setInsets] = useState<SafeAreaInsets>(ZERO);

  useEffect(() => {
    const update = () => setInsets(readInsets());
    update();
    window.addEventListener(SAFE_AREA_EVENT, update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener(SAFE_AREA_EVENT, update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return insets;
};

export { useSafeAreaInsets };
