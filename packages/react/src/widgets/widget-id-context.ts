/* @layer renderer-shell @kind logic */
import { createContext } from 'react';

const WidgetIdContext = createContext<string | null>(null);

export { WidgetIdContext };
