/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';

const pageShown = (): boolean => typeof document === 'undefined' || document.visibilityState === 'visible';

const useSamplingActive = (root: HTMLElement | null): boolean => {
  const [onScreen, setOnScreen] = useState(false);
  const [visible, setVisible] = useState(pageShown);

  useEffect(() => {
    const update = (): void => setVisible(pageShown());
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!root) {
      setOnScreen(false);
      return undefined;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => setOnScreen(entries.some((entry) => entry.isIntersecting)));
    observer.observe(root);
    return () => observer.disconnect();
  }, [root]);

  return onScreen && visible;
};

export { useSamplingActive };
