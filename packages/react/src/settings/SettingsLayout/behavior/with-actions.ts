/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Stack } from '@drizztdourden08/tessera/primitives';
import type { SettingItem, SettingValues } from '../../settings.type';
import { SettingActions } from '../sub-components/SettingActions';

const withActions = (content: ReactNode, item: SettingItem, disabled: boolean, settings: SettingValues): ReactNode => {
  const actions = item.actions ?? [];
  if (actions.length === 0) return content;
  return createElement(Stack, { gap: 'xs' }, content, createElement(SettingActions, { actions, disabled, settings }));
};

export { withActions };
