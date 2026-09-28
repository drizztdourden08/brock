/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { Platform } from '@drizztdourden08/brock-core';

const PlatformContext = createContext<Platform | null>(null);

export { PlatformContext };
