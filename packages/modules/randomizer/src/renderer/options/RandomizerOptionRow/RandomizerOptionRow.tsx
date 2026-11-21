/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { OptionRow } from '@drizztdourden08/tessera/composites';
import { tagFor } from '../behavior/tag-for';
import { PoolImpactCell } from '../PoolImpactCell';
import { hasDescription } from './behavior/has-description';
import type { RandomizerOptionRowProps } from './RandomizerOptionRow.type';
import { OptionControl } from './sub-components/OptionControl';
import { OptionDescription } from './sub-components/OptionDescription';

const RandomizerOptionRow = (props: RandomizerOptionRowProps) => {
  const text = useText();
  const { option, value, onChange, impact, disabled = false, note, readout = false } = props;
  const frozen = option.frozen === true || disabled;

  return (
    <OptionRow
      label={text(option.label)}
      description={hasDescription(option) ? <OptionDescription option={option} /> : undefined}
      tag={tagFor(option) ?? undefined}
      note={note}
      locked={frozen}
      forced={note !== undefined && note !== ''}
      control={<OptionControl option={option} value={value} frozen={frozen} readout={readout} onChange={onChange} />}
      aside={impact === undefined ? <Box /> : <PoolImpactCell cell={impact} />}
    />
  );
};

export { RandomizerOptionRow };
