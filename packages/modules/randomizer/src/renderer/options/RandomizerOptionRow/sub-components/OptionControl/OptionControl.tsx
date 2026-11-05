/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Select, Slider, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import { ValueTag } from '@drizztdourden08/tessera/composites';
import { optionKindOf } from '../../../behavior/option-kind-of';
import { choiceValueOf } from './behavior/choice-value-of';
import { readoutOf } from './behavior/readout-of';
import { selectItemsOf } from './behavior/select-items-of';
import { textValueOf } from './behavior/text-value-of';
import type { OptionControlProps } from './OptionControl.type';

const OptionControl = (props: OptionControlProps) => {
  const { option, value, frozen, readout, onChange } = props;
  const kind = optionKindOf(option);
  const items = useMemo(() => selectItemsOf(option), [option]);
  const inert = frozen || onChange === undefined;

  if (readout) return <ValueTag value={readoutOf(option, value)} />;
  if (kind === 'toggle') return <Toggle checked={Boolean(value)} onChange={(next) => onChange?.(next)} disabled={inert} />;
  if (kind === 'choice') {
    return <Select size="sm" value={String(value)} options={items} onChange={(next) => onChange?.(choiceValueOf(option, next))} disabled={inert} />;
  }
  if (kind === 'range' && option.range !== undefined) {
    return <Slider value={Number(value)} min={option.range.min} max={option.range.max} step={1} disabled={inert} onChange={(next) => onChange?.(next)} />;
  }
  return (
    <TextInput
      type={typeof value === 'number' ? 'number' : 'text'}
      value={String(value)}
      disabled={inert}
      onChange={(event) => onChange?.(textValueOf(value, event.target.value))}
    />
  );
};

export { OptionControl };
