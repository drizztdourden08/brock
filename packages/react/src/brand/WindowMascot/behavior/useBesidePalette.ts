/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { MascotStageHandle } from '@drizztdourden08/tessera/brand';
import { HINT_CLIP, MOVE_SLACK, PALETTE_SELECTOR, WALKER_ID } from '../WindowMascot.constants';
import type { WalkerSpot } from '../WindowMascot.type';
import { besideSpot } from './beside-spot';

const useBesidePalette = (stageRef: RefObject<MascotStageHandle | null>, open: boolean, width: number): WalkerSpot | null => {
  const [spot, setSpot] = useState<WalkerSpot | null>(null);

  useEffect(() => {
    const actor = width > 0 ? stageRef.current?.actor(WALKER_ID) : undefined;
    if (!actor) return undefined;
    const palette = open ? document.querySelector(PALETTE_SELECTOR) : null;
    if (!palette) {
      actor.autonomy(true);
      return undefined;
    }
    actor.autonomy(false);
    let live = true;
    let last = Number.NaN;
    const aim = (): void => {
      const stage = stageRef.current;
      if (!stage) return;
      const box = palette.getBoundingClientRect();
      const next = besideSpot({ left: stage.stageX(box.left), right: stage.stageX(box.right), width: stage.width() });
      if (Math.abs(next.x - last) < MOVE_SLACK) return;
      last = next.x;
      setSpot(next);
      void actor.moveTo(next.x, { face: next.face }).then((result) => {
        if (live && result === 'done') void actor.play(HINT_CLIP, { face: next.face });
      });
    };
    const observer = new ResizeObserver(aim);
    observer.observe(palette);
    aim();
    return () => {
      live = false;
      observer.disconnect();
      setSpot(null);
      actor.stop();
    };
  }, [stageRef, open, width]);

  return spot;
};

export { useBesidePalette };
