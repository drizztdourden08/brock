/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { fallbackText } from '../i18n/fallback-text';
import type { Section, TabDef } from '../settings/settings.type';
import { widgetPrefSection } from './widget-pref-section';
import { WIDGET_SETTINGS_TAB } from './widget.constants';
import type { WidgetDef } from './widget.type';

const widgetSettingsTabs = (definitions: readonly WidgetDef[], text: (value: Text) => string = fallbackText): TabDef<object>[] => {
  const sections = definitions.flatMap((def) => widgetPrefSection(def, text) ?? []);
  if (sections.length === 0) return [];
  return [{
    id: WIDGET_SETTINGS_TAB.id,
    label: text(WIDGET_SETTINGS_TAB.label),
    navIcon: createElement(Icon, { name: WIDGET_SETTINGS_TAB.icon }),
    group: WIDGET_SETTINGS_TAB.group,
    groupId: WIDGET_SETTINGS_TAB.groupId,
    sections: (): Section[] => sections,
  }];
};

export { widgetSettingsTabs };
