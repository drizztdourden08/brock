/* @layer renderer-shell @kind logic */
import { createRegistry } from '@drizztdourden08/brock-core';
import type { TabDef } from './settings.type';
import type { TabRegistry } from './tab-registry.type';

const createTabRegistry = <S extends object>(tabs: Iterable<TabDef<S>> = []): TabRegistry<S> => createRegistry(tabs);

export { createTabRegistry };
