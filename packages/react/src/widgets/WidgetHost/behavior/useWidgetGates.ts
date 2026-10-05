/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetGates, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { DEFAULT_CONTEXT } from '../../../contexts/contexts.constants';
import { useContextsStore } from '../../../contexts/useContextsStore';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { NO_IDS } from '../../widget.constants';
import type { WidgetDef } from '../../widget.type';
import { outOfContext } from '../../out-of-context';

const ID_JOIN = '\n';

const useHiddenIds = (definitions: readonly WidgetDef[], layout: WidgetLayout, legacy: boolean | null): string => {
  const contexts = useContextsStore((s) => s.contexts);
  return useMemo(() => {
    if (isReviewLaunch()) return '';
    const isActive = (name: string): boolean => (name === DEFAULT_CONTEXT && legacy !== null ? legacy : contexts[name]?.active === true);
    return outOfContext(layout, definitions, isActive).join(ID_JOIN);
  }, [definitions, layout, legacy, contexts]);
};

const useWidgetGates = (definitions: readonly WidgetDef[], layout: WidgetLayout, legacy: boolean | null): WidgetGates => {
  const hidden = useHiddenIds(definitions, layout, legacy);
  const pageOpen = useNavigationStore((s) => s.active !== null);
  const developerTools = useDeveloperTools();
  return useMemo<WidgetGates>(() => {
    const out = new Set(hidden === '' ? NO_IDS : hidden.split(ID_JOIN));
    return {
      definitions, developerToolsEnabled: developerTools, contextActive: true, pageOpen, forcedIds: NO_IDS, contentIds: definitions.map((def) => def.id).filter((id) => !out.has(id)),
    };
  }, [definitions, developerTools, hidden, pageOpen]);
};

export { useWidgetGates };
