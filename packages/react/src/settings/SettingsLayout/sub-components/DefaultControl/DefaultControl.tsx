/* @layer renderer-shell @kind component */
import { SegmentedControl, Slider, Toggle } from '@drizztdourden08/tessera/primitives';
import type { DefaultControlProps } from './DefaultControl.type';

const DefaultControl = (props: DefaultControlProps) => {
  const { item, value, disabled, onChange } = props;
  const { control, label, description } = item;
  if (control?.kind === 'choice' && typeof value === 'string') {
    return (
      <SegmentedControl
        label={label}
        description={description}
        value={value}
        options={control.options}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
  if (control?.kind === 'range' && typeof value === 'number') {
    return (
      <Slider
        label={label}
        description={description}
        value={value}
        min={control.min}
        max={control.max}
        step={control.step}
        formatValue={control.format}
        showValue
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
  if (typeof value !== 'boolean') return null;
  return <Toggle label={label} description={description} checked={value} onChange={onChange} disabled={disabled} link={item.link} />;
};

export { DefaultControl };
