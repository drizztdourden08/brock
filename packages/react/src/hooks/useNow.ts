/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';

const useNow = (intervalMs: number, active = true): number => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs, active]);
  return now;
};

export { useNow };
