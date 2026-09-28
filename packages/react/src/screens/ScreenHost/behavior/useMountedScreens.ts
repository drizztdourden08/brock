/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { ScreenDef } from '../../screen.type';

const useMountedScreens = (active: ScreenDef | null): string[] => {
  const [kept, setKept] = useState<string[]>([]);

  useEffect(() => {
    if (!active?.keepMounted) return;
    setKept((ids) => (ids.includes(active.id) ? ids : [...ids, active.id]));
  }, [active]);

  if (!active || kept.includes(active.id)) return kept;
  return [...kept, active.id];
};

export { useMountedScreens };
