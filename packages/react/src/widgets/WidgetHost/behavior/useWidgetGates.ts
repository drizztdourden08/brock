/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetGates } from '@drizztdourden08/tessera/composites';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { useForcedWidgetStore } from '../../useForcedWidgetStore';
import type { WidgetDef } from '../../widget.type';
import { useContextActive } from './useContextActive';

const useWidgetGates = (definitions: readonly WidgetDef[], legacy: boolean | null): WidgetGates<WidgetDef> => {
  const contextActive = useContextActive(legacy);
  const pageOpen = useNavigationStore((s) => s.active !== null);
  const developerTools = useDeveloperTools();
  const forcedIds = useForcedWidgetStore((s) => s.ids);
  return useMemo<WidgetGates<WidgetDef>>(() => ({
    definitions, developerToolsEnabled: developerTools, contextActive, pageOpen, forcedIds, contentIds: definitions.map((def) => def.id),
  }), [definitions, developerTools, contextActive, pageOpen, forcedIds]);
};

export { useWidgetGates };
