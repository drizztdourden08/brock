/* @layer electron-main @kind logic */
import type { AppServices } from '@drizztdourden08/brock-core/augment';
import { readServices } from './read-services';

const forwardTo = <T extends object>(read: () => T): T => new Proxy({} as T, {
  get: (_target, key): unknown => Reflect.get(read(), key),
  has: (_target, key) => Reflect.has(read(), key),
  ownKeys: () => Reflect.ownKeys(read()),
  getOwnPropertyDescriptor: (_target, key) => {
    const found = Reflect.getOwnPropertyDescriptor(read(), key);
    return found ? { ...found, configurable: true } : undefined;
  },
});

const servicesProxy = forwardTo<AppServices>(readServices);

export { servicesProxy };
