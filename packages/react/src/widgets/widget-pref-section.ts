/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../i18n/fallback-text';
import type { Section } from '../settings/settings.type';
import { widgetPrefSource } from './widget-pref-source';
import type { WidgetDef } from './widget.type';

const widgetPrefSection = (def: WidgetDef, text: (value: Text) => string = fallbackText): Section | null => {
  const items = (def.prefs ?? []).map(({ default: _default, ...item }) => item);
  return items.length === 0 ? null : { id: `widget-${def.id}`, title: text(def.labelText), items, source: widgetPrefSource(def) };
};

export { widgetPrefSection };
