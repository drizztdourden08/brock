/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { contextLabelOf } from '../../../contexts/context-label-of';
import { useContextsStore } from '../../../contexts/useContextsStore';
import type { WidgetDef } from '../../widget.type';

const useContextSublabels = (definitions: readonly WidgetDef[]): readonly WidgetDef[] => {
  const contexts = useContextsStore((s) => s.contexts);
  return useMemo(() => {
    const labelled = definitions.map((def) => {
      const sublabel = (def.contexts ?? (def.context ? [def.context] : [])).map((name) => contextLabelOf(contexts, name)).find((label) => label !== undefined);
      return sublabel ? { ...def, sublabel } : def;
    });
    return labelled.some((def, index) => def !== definitions[index]) ? labelled : definitions;
  }, [definitions, contexts]);
};

export { useContextSublabels };
