/* @layer renderer-shell @kind types */
import type { Registry } from '@drizztdourden08/brock-core';
import type { TabDef } from './settings.type';

type TabRegistry<S extends object> = Registry<TabDef<S>>;

export type { TabRegistry };
