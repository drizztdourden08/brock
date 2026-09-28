/* @layer renderer-shell @kind logic */
import { createRegistry } from '@drizztdourden08/brock-core';
import type { ScreenRegistry } from './screen-registry.type';
import type { ScreenDef } from './screen.type';

const createScreenRegistry = (screens: Iterable<ScreenDef> = []): ScreenRegistry => createRegistry(screens);

export { createScreenRegistry };
