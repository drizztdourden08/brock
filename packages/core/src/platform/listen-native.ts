/* @layer core @kind logic */
import type { NativePlugin } from './native-plugin.type';

const listenNative = <D>(plugin: NativePlugin, eventName: string, listener: (data: D) => void): (() => void) => {
  const handle = Promise.resolve(plugin.addListener(eventName, listener as (data: never) => void));
  return () => { void handle.then((h) => h.remove()).catch(() => {}); };
};

export { listenNative };
