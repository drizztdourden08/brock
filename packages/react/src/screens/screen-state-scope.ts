/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import { APP_SCOPE } from './screens.constants';

const ScreenStateScope = createContext<string>(APP_SCOPE);

export { ScreenStateScope };
