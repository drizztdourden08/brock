/* @layer electron-main @kind logic */
import type { BridgeClient } from './bridge-client.type';

const pushListeners = () => {
  const byEvent = new Map<string, Set<(...args: unknown[]) => void>>();
  const on: BridgeClient['on'] = (event, listener) => {
    const call = (...args: unknown[]): void => {
      Reflect.apply(listener, undefined, args);
    };
    const set = byEvent.get(event.channel) ?? new Set();
    set.add(call);
    byEvent.set(event.channel, set);
    return () => {
      set.delete(call);
    };
  };
  const dispatch = (event: string, args: unknown[]): void => {
    for (const call of [...(byEvent.get(event) ?? [])]) void Promise.resolve().then(() => call(...args));
  };
  return { on, dispatch };
};

export { pushListeners };
