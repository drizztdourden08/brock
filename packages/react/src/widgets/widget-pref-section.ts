/* @layer renderer-shell @kind logic */
import type { Section } from '../settings/settings.type';
import { widgetPrefSource } from './widget-pref-source';
import type { WidgetDef } from './widget.type';

const widgetPrefSection = (def: WidgetDef): Section | null => {
  const items = (def.prefs ?? []).map(({ default: _default, ...item }) => item);
  return items.length === 0 ? null : { id: `widget-${def.id}`, title: def.label, items, source: widgetPrefSource(def) };
};

export { widgetPrefSection };
