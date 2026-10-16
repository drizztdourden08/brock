/* @layer renderer-shell @kind logic */
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { useWidgetKitStore } from './kits/useWidgetKitStore';
import type { WidgetKitState } from './kits/widget-kit.type';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import type { SharedStore } from './widget.type';

type Frames = WidgetLayout['frame'];

const kitLayout = (state: WidgetKitState): WidgetLayout | null => (state.active ? state.views[state.active]?.layout ?? null : null);

const kitPopped = (state: WidgetKitState): boolean => (kitLayout(state)?.popped.length ?? 0) > 0;

const anyPopped = (): boolean => useWidgetLayoutStore.getState().layout.popped.length > 0 || kitPopped(useWidgetKitStore.getState());

const frames = (): Frames => ({ ...useWidgetLayoutStore.getState().layout.frame, ...kitLayout(useWidgetKitStore.getState())?.frame });

const framesSource: SharedStore<Frames> = {
  getState: frames,
  subscribe: (listener) => {
    let prev = frames();
    const changed = (): void => {
      const next = frames();
      listener(next, prev);
      prev = next;
    };
    const offs = [useWidgetLayoutStore.subscribe(changed), useWidgetKitStore.subscribe(changed)];
    return () => {
      for (const off of offs) off();
    };
  },
};

const poppedSources = { anyPopped, kitPopped, framesSource };

export { poppedSources };
