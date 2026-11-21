/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { Button, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { ICON_SIZE } from '../ControllerPage.constants';
import type { PadActionButtonProps } from '../ControllerPage.type';

const PadActionButton = ({ action, disabled, entry }: PadActionButtonProps) => {
  const text = useText();
  const label = text(action.label);
  const select = useCallback(() => { void action.onSelect(entry); }, [action, entry]);

  if (!action.icon) {
    return <Button variant="ghost" size="xs" onClick={select} disabled={disabled}>{label}</Button>;
  }
  return (
    <IconButton variant="ghost" size="xs" label={label} title={label} onClick={select} disabled={disabled}>
      <Icon name={action.icon} size={ICON_SIZE} />
    </IconButton>
  );
};

export { PadActionButton };
