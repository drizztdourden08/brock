/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetGates, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { NO_IDS } from '../../widget.constants';
import type { WidgetDef } from '../../widget.type';
import { useHiddenIds } from './useHiddenIds';
import { ID_JOIN } from './useWidgetGates.constants';

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
