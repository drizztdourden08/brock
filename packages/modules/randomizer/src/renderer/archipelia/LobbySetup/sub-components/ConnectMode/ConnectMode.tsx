/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { CONNECT_LABEL, CONNECT_OPTIONS, REMOTE_NEEDS_ADDRESS } from './ConnectMode.constants';
import type { ConnectModeProps } from './ConnectMode.type';

const ConnectMode = ({ mode, location, onChange, disabled }: ConnectModeProps) => {
  const text = useText();
  const options = CONNECT_OPTIONS.map((option) => {
    const shown = { ...option, label: text(option.label) };
    return option.value === 'auto' && location === 'remote' ? { ...shown, disabled: text(REMOTE_NEEDS_ADDRESS) } : shown;
  });
  return (
    <SegmentedControl size="sm" aria-label={text(CONNECT_LABEL)} value={mode} disabled={disabled} options={options} onChange={onChange} />
  );
};

export { ConnectMode };
