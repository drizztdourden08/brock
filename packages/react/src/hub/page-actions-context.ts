/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { ReactNode } from 'react';

const PageActionsContext = createContext<(node: ReactNode) => void>(() => undefined);

export { PageActionsContext };
