/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { MascotClip } from '@drizztdourden08/tessera/brand';
import { EMPTY_CLIP, SETTLED_CLIP } from '../BrandSearchResults.constants';

const useNoMatchClip = (query: string): { animation: MascotClip; onFinish: () => void } => {
  const [settled, setSettled] = useState<string | null>(null);
  const onFinish = useCallback(() => setSettled(query), [query]);
  return { animation: settled === query ? SETTLED_CLIP : EMPTY_CLIP, onFinish };
};

export { useNoMatchClip };
