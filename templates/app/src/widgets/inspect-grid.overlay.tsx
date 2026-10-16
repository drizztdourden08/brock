/* @layer renderer-app @kind component */
import { useRef } from 'react';
import type { KitOverlayMeta } from '@drizztdourden08/brock-react';
import { Svg, SvgGroup, SvgLine } from '@drizztdourden08/tessera/primitives';
import { useInspectTracking } from '../hooks/useInspectTracking';
import { useInspectStore } from '../stores/useInspectStore';

const meta: KitOverlayMeta = { kit: 'inspect', label: 'Grid overlay' };

const stepsUpTo = (size: number, step: number): number[] => Array.from({ length: Math.floor(size / step) }, (_, index) => (index + 1) * step);

const InspectGridOverlay = () => {
  const box = useRef<SVGSVGElement>(null);
  const grid = useInspectStore((s) => s.grid);
  const centre = useInspectStore((s) => s.centre);
  const pointer = useInspectStore((s) => s.pointer);
  const view = useInspectStore((s) => s.view);
  useInspectTracking(box);
  const width = view?.width ?? 0;
  const height = view?.height ?? 0;

  return (
    <Svg ref={box} width="100%" height="100%" stroke="currentColor" aria-hidden="true">
      <SvgGroup opacity={0.1}>
        {stepsUpTo(width, grid).map((x) => <SvgLine key={`x${x}`} x1={x} x2={x} y1={0} y2={height} />)}
        {stepsUpTo(height, grid).map((y) => <SvgLine key={`y${y}`} x1={0} x2={width} y1={y} y2={y} />)}
      </SvgGroup>
      {centre && (
        <SvgGroup opacity={0.35} strokeDasharray="6 4">
          <SvgLine x1={width / 2} x2={width / 2} y1={0} y2={height} />
          <SvgLine x1={0} x2={width} y1={height / 2} y2={height / 2} />
        </SvgGroup>
      )}
      {pointer && (
        <SvgGroup opacity={0.7}>
          <SvgLine x1={pointer.x} x2={pointer.x} y1={0} y2={height} />
          <SvgLine x1={0} x2={width} y1={pointer.y} y2={pointer.y} />
        </SvgGroup>
      )}
    </Svg>
  );
};

export default InspectGridOverlay;
export { meta };
