/* @layer renderer-shell @kind logic */
import { createElement, use } from 'react';
import type { ComponentType } from 'react';
import { lazyLoads } from './lazy-loads';
import type { ComponentLoader, LazyComponent, SettledPromise } from './lazy.type';

const lazyComponent = <P extends object>(load: ComponentLoader<P>): LazyComponent<P> => {
  let pending: SettledPromise<ComponentType<P>> | null = null;

  const preload = (): Promise<ComponentType<P>> => {
    if (pending) return pending;
    const loading: SettledPromise<ComponentType<P>> = lazyLoads.track(load()).then(
      (module) => {
        loading.status = 'fulfilled';
        loading.value = module.default;
        return module.default;
      },
      (error: unknown) => {
        pending = null;
        throw error;
      },
    );
    pending = loading;
    return loading;
  };

  const Lazy = (props: P) => createElement(use(preload()), props);

  return Object.defineProperties(Lazy, {
    preload: { value: preload },
    loaded: { get: () => pending?.status === 'fulfilled' },
    displayName: { value: 'Lazy' },
  }) as LazyComponent<P>;
};

export { lazyComponent };
