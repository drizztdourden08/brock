/* @layer renderer-shell @kind constants */
import { createElement } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { TabDef } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { DisplaySettingsTab } from './DisplaySettingsTab';
import { displaySections } from './DisplaySettingsTab/behavior/display-sections';
import { hasWindowControls } from './DisplaySettingsTab/behavior/has-window-controls';

const DISPLAY_SETTINGS_TAB: TabDef<object> = {
  id: 'display',
  label: msg('display:tab.label'),
  navIcon: createElement(Icon, { name: 'monitor' }),
  group: msg('brock-settings:group.app'),
  groupId: 'app',
  sections: () => displaySections(hasWindowControls()),
  render: ({ settings, onChange }) => createElement(DisplaySettingsTab, { settings, onChange }),
};

export { DISPLAY_SETTINGS_TAB };
