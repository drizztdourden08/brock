/* @layer renderer-shell @kind types */
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';

interface CoreSignal {
  state: () => { status: string };
  subscribe: (fn: () => void) => () => void;
}

interface GateSignal {
  get: () => WidgetDisabledState | null;
  subscribe: (fn: () => void) => () => void;
}

export type { CoreSignal, GateSignal };
