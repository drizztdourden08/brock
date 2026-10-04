/* @layer renderer-shell @kind component */
import { Button, ButtonRow, Icon } from '@drizztdourden08/tessera/primitives';
import type { SettingActionsProps } from './SettingActions.type';
import { actionDisabled } from '../../behavior/action-disabled';
import { useActionRunner } from '../../behavior/useActionRunner';

const SettingActions = (props: SettingActionsProps) => {
  const { actions, disabled = false, align = 'end', settings } = props;
  const { busy, run } = useActionRunner();
  return (
    <ButtonRow align={align} gap="xs">
      {actions.map((action, index) => {
        const key = action.id ?? `${index}:${action.label}`;
        return (
          <Button
            key={key}
            size="sm"
            variant={action.variant ?? 'secondary'}
            icon={action.icon ? <Icon name={action.icon} /> : undefined}
            disabled={disabled || actionDisabled(action, settings)}
            loading={busy[key] === true}
            data-setting-action={action.id ?? action.label}
            onClick={() => void run(key, action, { settings })}
          >
            {action.label}
          </Button>
        );
      })}
    </ButtonRow>
  );
};

export { SettingActions };
