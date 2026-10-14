/* @layer renderer-shell @kind component */
import { Button, Flex, Icon } from '@drizztdourden08/tessera/primitives';
import type { DeviceActionsProps } from './DeviceActions.type';

const DeviceActions = (props: DeviceActionsProps) => {
  const { entry, actions } = props;
  if (actions.length === 0) return null;

  return (
    <Flex align="center" gap="sm" wrap>
      {actions.map(({ action, disabled }) => (
        <Button
          key={action.id}
          variant={action.variant ?? 'secondary'}
          size="sm"
          disabled={disabled}
          icon={action.icon ? <Icon name={action.icon} /> : undefined}
          onClick={() => { void action.onSelect(entry); }}
        >
          {action.label}
        </Button>
      ))}
    </Flex>
  );
};

export { DeviceActions };
