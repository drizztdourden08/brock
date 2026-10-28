/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useWidgetTitleStore } from '../../useWidgetTitleStore';
import type { WidgetDef } from '../../widget.type';

const useWidgetTitles = (definitions: readonly WidgetDef[]): readonly WidgetDef[] => {
  const titles = useWidgetTitleStore((s) => s.titles);
  return useMemo(() => {
    const titled = definitions.map((def) => (titles[def.id] === undefined ? def : { ...def, label: titles[def.id] ?? def.label }));
    return titled.some((def, index) => def !== definitions[index]) ? titled : definitions;
  }, [definitions, titles]);
};

export { useWidgetTitles };
