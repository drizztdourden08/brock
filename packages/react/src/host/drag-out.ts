/* @layer renderer-shell @kind logic */
import { requireHostApi } from './require-host-api';

const dragOut = (paths: string[]): Promise<void> => requireHostApi().dragOut(paths);

export { dragOut };
