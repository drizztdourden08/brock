/* @layer renderer-shell @kind types */
interface ControllerLiveState {
  buttons: boolean[];
  axes: number[];
}

interface ControllerStateStore {
  states: Record<string, ControllerLiveState>;
  listen: () => void;
}

export type { ControllerLiveState, ControllerStateStore };
