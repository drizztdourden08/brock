/* @layer renderer-shell @kind component */
import { REVIEW_MASK } from '../../review-mask.constants';
import { Small, Span } from '@drizztdourden08/tessera/primitives';
import { CALIBRATED_LABEL } from '../StickPlot.constants';
import { stickReadout } from '../behavior/stick-readout';
import type { StickPlotReadoutProps } from './StickPlotReadout.type';

const StickPlotReadout = (props: StickPlotReadoutProps) => {
  const { x, y, calibrated } = props;
  return (
    <Span tone="dim" className="input-stick-plot__value" {...REVIEW_MASK}>
      {stickReadout(x, y)}
      {calibrated && <Small tone="muted" className="input-stick-plot__cal">{CALIBRATED_LABEL}</Small>}
    </Span>
  );
};

export { StickPlotReadout };
