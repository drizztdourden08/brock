/* @layer core @kind types */
import type { InvokeContract, SendContract, EventContract, IpcNamespaces } from '../augment';
import type { InvokeMap, SendMap, EventMap } from './maps.type';
import type { BASE_INVOKE_MAP, BASE_SEND_MAP, BASE_EVENT_MAP } from './maps.constants';

type InvokeApi<M extends InvokeMap> = { [K in keyof M]: InvokeContract[M[K]] };
type SendApi<M extends SendMap> = { [K in keyof M]: SendContract[M[K]] };
type EventApi<M extends EventMap> = { [K in keyof M]: (cb: EventContract[M[K]]) => () => void };

interface StartupInfo {
  fresh: boolean;
  automation: boolean;
  muted: boolean;
  sound: boolean;
  flags: Record<string, string | true>;
}

interface InstanceInfo {
  name: string | null;
  profile: string | null;
}

interface IpcHostApi {
  isDev: boolean;
  os: NodeJS.Platform;
  getFilePath: (file: File) => string;
  startup: StartupInfo;
  instance: InstanceInfo;
}

type IpcApi<
  I extends InvokeMap = typeof BASE_INVOKE_MAP,
  S extends SendMap = typeof BASE_SEND_MAP,
  E extends EventMap = typeof BASE_EVENT_MAP,
> = IpcHostApi & InvokeApi<I> & SendApi<S> & EventApi<E> & IpcNamespaces;

interface AppIpcMaps {
  invoke?: InvokeMap;
  send?: SendMap;
  events?: EventMap;
}

type AppIpcApi<M extends AppIpcMaps = AppIpcMaps> = IpcApi
  & (M extends { invoke: infer I extends InvokeMap } ? InvokeApi<I> : unknown)
  & (M extends { send: infer S extends SendMap } ? SendApi<S> : unknown)
  & (M extends { events: infer E extends EventMap } ? EventApi<E> : unknown);

export type { AppIpcApi, AppIpcMaps, InvokeApi, SendApi, EventApi, IpcApi, IpcHostApi, StartupInfo, InstanceInfo };
