/* @layer renderer-shell @kind component */
import { Box, Icon, IconButton, PathIcon } from '@drizztdourden08/tessera/primitives';
import { usePlatform } from '../../../../platform/usePlatform';
import { CLOSE_PATHS, MAXIMIZE_PATHS, MINIMIZE_PATHS, RESTORE_PATHS, SMALL_VIEWBOX } from './WindowControls.constants';
import type { WindowControlsProps } from './WindowControls.type';

const WindowControls = (props: WindowControlsProps) => {
  const { isMaximized, isFullscreen } = props;
  const { window: win } = usePlatform();

  return (
    <Box className="titlebar__right">
      <IconButton
        variant="ghost"
        className="titlebar__control"
        onClick={() => win.toggleFullscreen()}
        label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        <Icon name={isFullscreen ? 'minimize-2' : 'maximize-2'} size={12} />
      </IconButton>
      <IconButton variant="ghost" className="titlebar__control" onClick={() => win.minimize()} label="Minimize">
        <PathIcon paths={MINIMIZE_PATHS} size={12} viewBox={SMALL_VIEWBOX} />
      </IconButton>
      <IconButton
        variant="ghost"
        className="titlebar__control"
        onClick={() => win.toggleMaximize()}
        label={isMaximized ? 'Restore' : 'Maximize'}
      >
        <PathIcon paths={isMaximized ? RESTORE_PATHS : MAXIMIZE_PATHS} size={12} viewBox={SMALL_VIEWBOX} />
      </IconButton>
      <IconButton
        variant="ghost"
        className="titlebar__control titlebar__control--close"
        onClick={() => win.close()}
        label="Close"
      >
        <PathIcon paths={CLOSE_PATHS} size={12} viewBox={SMALL_VIEWBOX} />
      </IconButton>
    </Box>
  );
};

export { WindowControls };
