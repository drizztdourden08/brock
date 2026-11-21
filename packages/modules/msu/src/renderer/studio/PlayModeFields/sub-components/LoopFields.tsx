/* @layer renderer-shell @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '@drizztdourden08/brock-react';
import { CrossfadeField } from '../../LayerEditor/sub-components/CrossfadeField';
import { ORDER_HINTS, ORDER_OPTIONS } from '../PlayModeFields.constants';
import type { LoopFieldsProps } from './LoopFields.type';

const LoopFields = (props: LoopFieldsProps) => {
  const { mode, layerId, disabled, onChange } = props;
  const t = useT();
  const text = useText();
  return (
    <>
      <SegmentedControl
        label={t('msu:play.order')}
        description={text(ORDER_HINTS[mode.order])}
        value={mode.order}
        options={ORDER_OPTIONS.map((option) => ({ ...option, label: text(option.label) }))}
        disabled={disabled}
        onChange={(order) => onChange({ ...mode, order })}
      />
      {mode.order !== 'single' && (
        <CrossfadeField
          seconds={mode.crossfadeSeconds ?? 0}
          layerId={layerId}
          disabled={disabled}
          onChange={(crossfadeSeconds) => onChange({ ...mode, crossfadeSeconds })}
        />
      )}
    </>
  );
};

export { LoopFields };
