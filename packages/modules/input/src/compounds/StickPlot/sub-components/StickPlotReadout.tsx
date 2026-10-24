/* @layer renderer-shell @kind component */
import { REVIEW_MASK } from '../../review-mask.constants';
import { Small, Span, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import { stickReadout } from '../behavior/stick-readout';
import type { StickPlotReadoutProps } from './StickPlotReadout.type';

const StickPlotReadout = (props: StickPlotReadoutProps) => {
  const { x, y, calibrated } = props;
  const { panels } = useTesseraStrings();
  return (
    <Span tone="dim" className="input-stick-plot__value" {...REVIEW_MASK}>
      {stickReadout(x, y)}
      {calibrated && <Small tone="muted" className="input-stick-plot__cal">{panels.calibrated}</Small>}
    </Span>
  );
};

export { StickPlotReadout };
