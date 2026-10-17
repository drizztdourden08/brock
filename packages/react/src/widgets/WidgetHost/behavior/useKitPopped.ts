/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import type { PoppedWidget, ScreenPoint, WidgetGates } from '@drizztdourden08/tessera/composites';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { kitRoute } from '../../kits/kit-route';
import { popOutWindow } from '../../pop-out-window';
import { poppedShown } from '../../popped-shown';
import { useForcedWidgetStore } from '../../useForcedWidgetStore';
import type { WidgetDef } from '../../widget.type';
import { NO_POPPED } from '../WidgetHost.constants';
import type { KitPoppedInput } from '../WidgetHost.type';

const useKitPopped = (input: KitPoppedInput) => {
  const { definitions, layout, blocked, contextActive, pageOpen, extraOf } = input;
  const developerTools = useDeveloperTools();
  const forcedIds = useForcedWidgetStore((s) => s.ids);
  const gates = useMemo<WidgetGates<WidgetDef>>(() => ({
    definitions, developerToolsEnabled: developerTools, contextActive: contextActive ?? true, pageOpen, forcedIds, contentIds: definitions.map((def) => def.id),
  }), [definitions, developerTools, contextActive, pageOpen, forcedIds]);
  const popped = useMemo<readonly PoppedWidget[]>(() => (layout && !blocked ? poppedShown(layout, gates) : NO_POPPED), [layout, blocked, gates]);
  const onPopOut = useCallback((id: string, point?: ScreenPoint) => {
    const current = kitRoute.openLayoutOf(id);
    if (current) popOutWindow({ layout: current, gates, id, extra: extraOf(id), point });
  }, [gates, extraOf]);
  return { popped, onPopOut };
};

export { useKitPopped };
