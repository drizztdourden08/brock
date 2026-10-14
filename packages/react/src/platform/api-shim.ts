/* @layer renderer-shell @kind logic */
import { BASE_LIST_METHODS, BASE_RETURNS } from './api-shim.constants';
import { HOST_API_GLOBAL } from '../host/host.constants';
import { windowGlobal } from '../host/window-global';
import type { AnyFn, ApiShimMaps, ApiShimOptions, Returns } from './api-shim.type';

const eventStub = (): (() => void) => () => {};
const emptyList = (): unknown[] => [];
const nothing = (): null => null;

const invokeStub = (method: string, lists: Set<string>, returns: Returns): AnyFn => {
  const shaped = returns[method] ?? (lists.has(method) ? emptyList : nothing);
  return () => Promise.resolve().then(shaped);
};

const osFromUserAgent = (): NodeJS.Platform => {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  if (/Windows/i.test(ua)) return 'win32';
  if (/Mac OS/i.test(ua)) return 'darwin';
  return 'linux';
};

const installApiShim = (maps: ApiShimMaps, options: ApiShimOptions = {}): void => {
  if (windowGlobal.read(HOST_API_GLOBAL)) return;

  const lists = new Set([...BASE_LIST_METHODS, ...(options.listMethods ?? [])]);
  const returns = { ...BASE_RETURNS, ...(options.returns ?? {}) };

  const api: Record<string, unknown> = {
    isDev: false,
    os: osFromUserAgent(),
    getFilePath: () => '',
    startup: { fresh: false, automation: false, muted: false, sound: false, flags: {} },
    instance: { name: null, profile: null },
    ...(options.helpers ?? {}),
  };

  for (const method of Object.keys(maps.invoke)) api[method] = invokeStub(method, lists, returns);
  for (const method of Object.keys(maps.send)) api[method] = () => {};
  for (const method of Object.keys(maps.events)) api[method] = eventStub;

  windowGlobal.write(HOST_API_GLOBAL, api);
};

export { installApiShim };
