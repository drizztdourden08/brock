/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetGates } from '@drizztdourden08/tessera/composites';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { NO_IDS } from '../../widget.constants';
import type { WidgetDef } from '../../widget.type';
import type { WidgetContextSource } from '../WidgetHost.type';

const alwaysInContext: WidgetContextSource = () => true;

const useWidgetGates = (definitions: readonly WidgetDef[], source: WidgetContextSource = alwaysInContext): WidgetGates => {
  const useContextSource = source;
  const inContext = useContextSource();
  const contextActive = inContext || isReviewLaunch();
  const pageOpen = useNavigationStore((s) => s.active !== null);
  const developerTools = useDeveloperTools();
  return useMemo<WidgetGates>(() => ({
    definitions, developerToolsEnabled: developerTools, contextActive, pageOpen, forcedIds: NO_IDS, contentIds: definitions.map((def) => def.id),
  }), [definitions, developerTools, contextActive, pageOpen]);
};

export { useWidgetGates };
