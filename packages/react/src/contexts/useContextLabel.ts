/* @layer renderer-shell @kind hook */
import { contextLabelOf } from './context-label-of';
import { useContextsStore } from './useContextsStore';

const useContextLabel = (name: string | undefined): string | undefined =>
  useContextsStore((s) => contextLabelOf(s.contexts, name));

export { useContextLabel };
