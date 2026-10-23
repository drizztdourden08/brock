/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { COMMAND_RANKS } from '../../../commands/commands.constants';
import { useCommandSource } from '../../../commands/useCommandSource';
import { usePlatform } from '../../../platform/usePlatform';
import { useBrock } from '../../useBrock';
import { shellCommands } from './shell-commands';

const useShellCommands = (): void => {
  const { window: win } = usePlatform();
  const { product } = useBrock();
  const fullscreenable = product.window.titleBar.controls.fullscreen;
  const defs = useMemo(() => shellCommands(fullscreenable ? () => win.toggleFullscreen() : undefined), [win, fullscreenable]);
  useCommandSource(COMMAND_RANKS.brock, defs);
};

export { useShellCommands };
