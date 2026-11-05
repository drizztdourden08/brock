/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import type { AudibleScan } from './audible-ids.type';

const useAudibleIds = (target: string, ids: number[]): AudibleScan => {
  const { preview } = useMsuStudioGame<never, string>();
  const [audible, setAudible] = useState<ReadonlySet<number> | null>(null);
  const span = `${ids.length}:${ids[0]}:${ids[ids.length - 1]}`;

  useEffect(() => {
    setAudible(null);
    if (preview === undefined) return undefined;
    let cancelled = false;
    const handle = setTimeout(() => {
      void preview.probeAudible(target, ids).then((found) => {
        if (!cancelled) setAudible(found.size > 0 ? found : null);
      });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [preview, target, span]);

  return { audible };
};

export { useAudibleIds };
