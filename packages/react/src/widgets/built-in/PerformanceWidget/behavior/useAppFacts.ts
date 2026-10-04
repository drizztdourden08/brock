/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { useBrock } from '../../../../app/useBrock';
import { useAppVersion } from '../../../../diagnostics/useAppVersion';
import { useNavigationStore } from '../../../../navigation/useNavigationStore';
import { useProfilesStore } from '../../../../stores/useProfilesStore';
import { useWidgetLayoutStore } from '../../../useWidgetLayoutStore';
import type { AppFacts } from '../PerformanceWidget.type';
import { routeText } from './route-text';
import { useLogCounts } from './useLogCounts';

const useAppFacts = (): AppFacts => {
  const { moduleIds } = useBrock();
  const version = useAppVersion();
  const screen = useNavigationStore((s) => s.active);
  const params = useNavigationStore((s) => s.params);
  const profile = useProfilesStore((s) => s.active?.name ?? null);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const definitions = useWidgetLayoutStore((s) => s.definitions);
  const counts = useLogCounts();
  const openWidgets = useMemo(() => definitions.filter((def) => isWidgetOpen(layout, def.id)).map((def) => def.id), [definitions, layout]);
  const route = useMemo(() => routeText(params), [params]);

  return { version, screen, route, profile, openWidgets, modules: moduleIds, warnings: counts.warn, errors: counts.error };
};

export { useAppFacts };
