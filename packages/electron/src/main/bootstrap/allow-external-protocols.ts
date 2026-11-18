/* @layer electron-main @kind logic */
import type { BootstrapOptions } from '../types/main-context.type';
import { externalProtocols } from '../window/external-protocols';

const allowExternalProtocols = (options: BootstrapOptions): void => {
  if (options.security?.externalProtocols) externalProtocols.allowed = new Set(options.security.externalProtocols);
};

export { allowExternalProtocols };
