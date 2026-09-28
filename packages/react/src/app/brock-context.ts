/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { BrockContextValue } from './brock-context.type';

const BrockContext = createContext<BrockContextValue | null>(null);

export { BrockContext };
