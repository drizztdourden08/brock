/* @layer renderer-shell @kind component */
import { Toggle } from '@drizztdourden08/tessera/primitives';
import type { LinkedToggleProps } from './LinkedToggle.type';

const LinkedToggle = (props: LinkedToggleProps) => {
  const { item, checked, disabled, onChange } = props;
  return (
    <Toggle
      label={item.label}
      description={item.description}
      hint={{ label: '', description: item.hint }}
      link={item.link}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export { LinkedToggle };
