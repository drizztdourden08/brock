/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetGates } from '@drizztdourden08/tessera/composites';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { NO_IDS } from '../../widget.constants';
import type { WidgetDef } from '../../widget.type';
import { useContextActive } from './useContextActive';

const useWidgetGates = (definitions: readonly WidgetDef[], legacy: boolean | null): WidgetGates<WidgetDef> => {
  const contextActive = useContextActive(legacy);
  const pageOpen = useNavigationStore((s) => s.active !== null);
  const developerTools = useDeveloperTools();
  return useMemo<WidgetGates<WidgetDef>>(() => ({
    definitions, developerToolsEnabled: developerTools, contextActive, pageOpen, forcedIds: NO_IDS, contentIds: definitions.map((def) => def.id),
  }), [definitions, developerTools, contextActive, pageOpen]);
};

export { useWidgetGates };
