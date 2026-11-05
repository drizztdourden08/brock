/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { MsuStudioContextValue } from './msu-studio-value.type';

const MsuStudioContext = createContext<MsuStudioContextValue | null>(null);

export { MsuStudioContext };
