/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { ScreenRegistry } from './screen-registry.type';

const ScreenRegistryContext = createContext<ScreenRegistry | null>(null);

export { ScreenRegistryContext };
