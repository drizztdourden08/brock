/* @layer core @kind types */
interface NativeListenerHandle {
  remove: () => unknown;
}

interface NativePlugin {
  addListener(eventName: string, listener: (data: never) => void): NativeListenerHandle | Promise<NativeListenerHandle>;
}

export type { NativeListenerHandle, NativePlugin };
