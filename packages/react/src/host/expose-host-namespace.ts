/* @layer renderer-shell @kind logic */
import { HOST_API_GLOBAL } from './host.constants';
import { windowGlobal } from './window-global';

const exposeHostNamespace = (id: string, value: unknown): void => {
  const api = windowGlobal.read(HOST_API_GLOBAL);
  if (!api || typeof api !== 'object' || id in api) return;
  Reflect.set(api, id, value);
};

export { exposeHostNamespace };
