/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { usePlatform } from '../../../platform/usePlatform';

const useTitleBar = () => {
  const { window: win } = usePlatform();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    void win.isMaximized().then(setIsMaximized);
    return win.onMaximizedChange(setIsMaximized);
  }, [win]);

  useEffect(() => {
    void win.isFullscreen().then(setIsFullscreen);
    return win.onFullscreenChange(setIsFullscreen);
  }, [win]);

  return { isMaximized, isFullscreen };
};

export { useTitleBar };
