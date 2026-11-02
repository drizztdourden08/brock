/* @layer renderer-shell @kind hook */
import { createDefaultLayout, frameOf } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { RELAY_SLICES } from '../../widget.constants';
import type { WidgetDef } from '../../widget.type';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';

const useWindowFrame = (id: string, definition: WidgetDef | undefined): ReturnType<typeof frameOf> => {
  const frames = useWidgetRelayStore((s) => s.slices[RELAY_SLICES.frames]) as WidgetLayout['frame'] | undefined;
  return frameOf({ ...createDefaultLayout(), frame: frames ?? {} }, id, definition);
};

export { useWindowFrame };
