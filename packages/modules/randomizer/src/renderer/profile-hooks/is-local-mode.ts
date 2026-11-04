/* @layer renderer-shell @kind logic */
import { LOCAL_MODE } from './local-mode.constants';

const isLocalMode = (mode: string): boolean => mode === LOCAL_MODE;

export { isLocalMode };
