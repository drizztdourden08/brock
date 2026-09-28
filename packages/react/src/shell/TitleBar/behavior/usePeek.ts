/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { PEEK_ZONE_PX } from '../TitleBar.constants';

const usePeek = (hidden: boolean, barRef: RefObject<HTMLElement | null>) => {
  const [peeking, setPeeking] = useState(false);

  useEffect(() => {
    if (!hidden) { setPeeking(false); return; }
    const onMove = (e: MouseEvent) => {
      if (barRef.current?.contains(e.target as Node)) return;
      setPeeking(e.clientY <= PEEK_ZONE_PX);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [hidden, barRef]);

  const handleMouseLeave = () => { if (hidden) setPeeking(false); };

  return { peeking, handleMouseLeave };
};

export { usePeek };
