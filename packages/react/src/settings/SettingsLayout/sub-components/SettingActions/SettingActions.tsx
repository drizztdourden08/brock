/* @layer renderer-shell @kind component */
import { Button, ButtonRow, Icon } from '@drizztdourden08/tessera/primitives';
import { useSettingActionRun } from './behavior/useSettingActionRun';
import type { SettingActionsProps } from './SettingActions.type';
import { actionDisabled } from '../../behavior/action-disabled';

const SettingActions = (props: SettingActionsProps) => {
  const { actions, disabled = false, align = 'end', settings } = props;
  const { busy, run } = useSettingActionRun(settings);
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
            disabled={disabled || actionDisabled(action, settings) || (busy !== null && busy !== key)}
            loading={busy === key}
            data-setting-action={action.id ?? action.label}
            onClick={() => void run(action, key)}
          >
            {action.label}
          </Button>
        );
      })}
    </ButtonRow>
  );
};

export { SettingActions };
