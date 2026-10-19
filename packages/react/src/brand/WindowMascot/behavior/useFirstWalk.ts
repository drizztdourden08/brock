/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { MascotStageHandle } from '@drizztdourden08/tessera/brand';
import { WALKER_EDGE_FRACTION, WALKER_HALF, WALKER_ID } from '../WindowMascot.constants';

const useFirstWalk = (stageRef: RefObject<MascotStageHandle | null>, width: number, paletteOpen: boolean): void => {
  const started = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (started.current || paletteOpen || !stage || width <= WALKER_HALF * 4 || stage.width() <= WALKER_HALF * 4) return;
    const actor = stage.actor(WALKER_ID);
    if (!actor) return;
    started.current = true;
    const edge = Math.random() < 0.5 ? WALKER_EDGE_FRACTION : 1 - WALKER_EDGE_FRACTION;
    void actor.moveTo(stage.width() * edge);
  }, [stageRef, width, paletteOpen]);
};

export { useFirstWalk };
