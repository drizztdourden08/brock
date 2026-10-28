/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { Section, TabDef } from '../settings/settings.type';
import { widgetPrefSection } from './widget-pref-section';
import { WIDGET_SETTINGS_TAB } from './widget.constants';
import type { WidgetDef } from './widget.type';

const widgetSettingsTab = (definitions: readonly WidgetDef[]): TabDef<object> | null => {
  const sections = definitions.flatMap((def) => widgetPrefSection(def) ?? []);
  if (sections.length === 0) return null;
  return {
    id: WIDGET_SETTINGS_TAB.id,
    label: WIDGET_SETTINGS_TAB.label,
    navIcon: createElement(Icon, { name: WIDGET_SETTINGS_TAB.icon }),
    group: WIDGET_SETTINGS_TAB.group,
    groupId: WIDGET_SETTINGS_TAB.groupId,
    sections: (): Section[] => sections,
  };
};

export { widgetSettingsTab };
