/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WidgetDef } from './widget.type';

const resolveWidgetLabels = (definitions: readonly WidgetDef[], text: (value: Text) => string, titles: Readonly<Record<string, string>> = {}): readonly WidgetDef[] => {
  const resolved = definitions.map((def) => {
    const label = titles[def.id] ?? text(def.labelText);
    return label === def.label ? def : { ...def, label };
  });
  return resolved.some((def, index) => def !== definitions[index]) ? resolved : definitions;
};

export { resolveWidgetLabels };
