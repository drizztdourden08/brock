/* @layer renderer-shell @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import type { PinButtonProps } from './PinButton.type';

const PinButton = (props: PinButtonProps) => {
  const { pinned, onToggle } = props;
  return (
    <IconButton
      variant="ghost"
      size="sm"
      active={pinned}
      label={pinned ? 'Unpin window' : 'Pin window on top'}
      onClick={onToggle}
    >
      <Icon name={pinned ? 'pin-off' : 'pin'} size={14} />
    </IconButton>
  );
};

export { PinButton };
