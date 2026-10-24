/* @layer renderer-shell @kind component */
import { SvgCircle, SvgPath } from '@drizztdourden08/tessera/primitives';
import { annulusPath } from '../behavior/annulus-path';
import type { StickPlotZonesProps } from './StickPlotZones.type';

const StickPlotZones = (props: StickPlotZonesProps) => {
  const { innerDeadzone, outerDeadzone } = props;

  return (
    <>
      {outerDeadzone !== undefined && outerDeadzone < 1 && (
        <SvgPath className="input-stick-plot__zone input-stick-plot__zone--outer" d={annulusPath(outerDeadzone, 1)} fillRule="evenodd" />
      )}
      {innerDeadzone !== undefined && innerDeadzone > 0 && (
        <SvgCircle className="input-stick-plot__zone input-stick-plot__zone--inner" cx={0} cy={0} r={innerDeadzone} vectorEffect="non-scaling-stroke" />
      )}
    </>
  );
};

export { StickPlotZones };
