/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { contextLabelOf } from '../../../contexts/context-label-of';
import { contextTitle } from '../../../contexts/context-title';
import { useContextsStore } from '../../../contexts/useContextsStore';
import type { WidgetDef } from '../../widget.type';

const useContextTitles = (definitions: readonly WidgetDef[]): readonly WidgetDef[] => {
  const contexts = useContextsStore((s) => s.contexts);
  return useMemo(() => {
    const titled = definitions.map((def) => {
      const label = contextLabelOf(contexts, def.context);
      return label ? { ...def, label: contextTitle(def.label, label) } : def;
    });
    return titled.some((def, index) => def !== definitions[index]) ? titled : definitions;
  }, [definitions, contexts]);
};

export { useContextTitles };
