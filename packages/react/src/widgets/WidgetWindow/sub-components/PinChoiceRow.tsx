/* @layer renderer-shell @kind component */
import type { WidgetPinMode } from '@drizztdourden08/brock-core';
import { OptionRow } from '@drizztdourden08/tessera/composites';
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { PIN_SEGMENTS, PIN_TEXT } from '../WidgetWindow.constants';
import type { PinControlProps } from '../WidgetWindow.type';

const PinChoiceRow = (props: PinControlProps) => {
  const { pin, onPinChange } = props;
  return (
    <OptionRow label={PIN_TEXT.row}>
      <SegmentedControl<WidgetPinMode> size="sm" aria-label={PIN_TEXT.menu} value={pin} options={PIN_SEGMENTS} onChange={onPinChange} />
    </OptionRow>
  );
};

export { PinChoiceRow };
