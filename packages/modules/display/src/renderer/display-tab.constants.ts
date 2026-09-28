/* @layer renderer-shell @kind constants */
import { createElement } from 'react';
import type { TabDef } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { DisplaySettingsTab } from './DisplaySettingsTab';

const DISPLAY_SETTINGS_TAB: TabDef<object> = {
  id: 'display',
  label: 'Display',
  navIcon: createElement(Icon, { name: 'monitor' }),
  group: 'App',
  render: ({ settings, onChange }) => createElement(DisplaySettingsTab, { settings, onChange }),
};

export { DISPLAY_SETTINGS_TAB };
