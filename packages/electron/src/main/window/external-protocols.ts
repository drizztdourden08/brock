/* @layer electron-main @kind logic */
import { DEFAULT_EXTERNAL_PROTOCOLS } from './security.constants';

const externalProtocols = { allowed: new Set<string>(DEFAULT_EXTERNAL_PROTOCOLS) };

export { externalProtocols };
