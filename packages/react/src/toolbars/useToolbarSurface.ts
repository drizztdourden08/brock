/* @layer renderer-shell @kind hook */
import { useToolbarCommands } from './useToolbarCommands';
import { useToolbarContextMenu } from './useToolbarContextMenu';

const useToolbarSurface = (): void => {
  useToolbarCommands();
  useToolbarContextMenu();
};

export { useToolbarSurface };
