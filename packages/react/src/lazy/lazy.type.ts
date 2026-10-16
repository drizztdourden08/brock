/* @layer renderer-shell @kind types */
import type { ComponentType, ReactElement } from 'react';

type ComponentLoader<P> = () => Promise<{ default: ComponentType<P> }>;

type LazyComponent<P> = ((props: P) => ReactElement) & {
  preload: () => Promise<ComponentType<P>>;
  readonly loaded: boolean;
};

type SettledPromise<T> = Promise<T> & { status?: 'fulfilled'; value?: T };

interface Preloadable {
  preload?: () => Promise<unknown>;
}

export type { ComponentLoader, LazyComponent, Preloadable, SettledPromise };
