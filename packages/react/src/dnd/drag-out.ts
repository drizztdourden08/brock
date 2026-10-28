/* @layer renderer-shell @kind logic */
import { dragOutState } from './drag-out-state';

const dragOut = (paths: readonly string[]): Promise<boolean> => {
  const { host } = dragOutState;
  return host && paths.length > 0 ? host.start(paths) : Promise.resolve(false);
};

export { dragOut };
