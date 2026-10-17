/* @layer renderer-shell @kind component */
import { useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { MascotStage } from '@drizztdourden08/tessera/brand';
import type { MascotStageCast, MascotStageHandle } from '@drizztdourden08/tessera/brand';
import { Box, Callout, Portal } from '@drizztdourden08/tessera/primitives';
import { usePaletteOpen } from '../../../palette/usePaletteOpen';
import { REST_CLIP, WALKER_HEIGHT, WALKER_ID } from '../WindowMascot.constants';
import type { WalkerSetup } from '../WindowMascot.type';
import { useBesidePalette } from '../behavior/useBesidePalette';
import { useProbeRect } from '../behavior/useProbeRect';

const WalkerLayer = (props: WalkerSetup) => {
  const { brand, hint } = props;
  const probeRef = useRef<HTMLElement>(null);
  const stageRef = useRef<MascotStageHandle>(null);
  const rect = useProbeRect(probeRef);
  const spot = useBesidePalette(stageRef, usePaletteOpen(), rect?.width ?? 0);
  const cast = useMemo<MascotStageCast[]>(() => [{ id: WALKER_ID, brand, clip: REST_CLIP, autonomy: true }], [brand]);
  const place: CSSProperties | null = rect && { left: rect.left, top: rect.top + rect.height - WALKER_HEIGHT, width: rect.width, height: WALKER_HEIGHT };

  return (
    <>
      <Box ref={probeRef} className="window-mascot__probe" aria-hidden />
      {place && (
        <Portal layer="overlay">
          <Box className="window-mascot" data-window-mascot={brand} data-beside={spot ? 'palette' : undefined} style={place} aria-hidden inert>
            <MascotStage ref={stageRef} cast={cast} height={WALKER_HEIGHT} label={hint} />
            {spot && (
              <Box className="window-mascot__hint" data-face={spot.face} style={{ '--hint-x': `${spot.x}px` } as CSSProperties}>
                <Callout tone="info">{hint}</Callout>
              </Box>
            )}
          </Box>
        </Portal>
      )}
    </>
  );
};

export { WalkerLayer };
