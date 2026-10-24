/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { ToolbarHost } from '../../../../toolbars/ToolbarHost';
import { NO_TOOLBARS } from '../../../../toolbars/toolbar.constants';
import type { AppStageProps } from './AppStage.type';

const AppStage = ({ toolbars, railed, children }: AppStageProps) => {
  const list = toolbars ?? NO_TOOLBARS;
  const docked = list.length > 0;
  const inner = docked ? <ToolbarHost toolbars={list}>{children}</ToolbarHost> : children;
  return railed || docked ? <Box className={`brock-app__stage${docked ? ' brock-app__stage--docked' : ''}`}>{inner}</Box> : inner;
};

export { AppStage };
