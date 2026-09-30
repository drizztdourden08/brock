/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { WindowTitleBar } from '@drizztdourden08/tessera/composites';
import { usePlatform } from '../../../../platform/usePlatform';
import { usePinWindow } from '../../../../shell/TitleBar/behavior/usePinWindow';
import { useTitleBar } from '../../../../shell/TitleBar/behavior/useTitleBar';
import { TitleBarMenu } from '../../../../shell/TitleBar/sub-components/TitleBarMenu';
import { TitleBarSlots } from '../../../../shell/TitleBar/sub-components/TitleBarSlots';
import type { AppTitleBarProps } from './AppTitleBar.type';

const AppTitleBar = (props: AppTitleBarProps) => {
  const { title, menu, instanceName, logoSrc, instanceLogoSrc, slots, hidden } = props;
  const menuRef = useRef<HTMLElement>(null);
  const { window: win } = usePlatform();
  const { isMaximized, isFullscreen, menuOpen, toggleMenu, closeMenu } = useTitleBar(menuRef);
  const { pinned, togglePin } = usePinWindow();

  return (
    <WindowTitleBar
      title={title}
      logo={logoSrc}
      instance={instanceName ? { name: instanceName, logo: instanceLogoSrc } : null}
      menu={menu.length > 0 && <TitleBarMenu menu={menu} open={menuOpen} onToggle={toggleMenu} onClose={closeMenu} anchorRef={menuRef} />}
      menuOpen={menuOpen}
      menuAnchorRef={menuRef}
      pinned={pinned}
      onPinToggle={() => void togglePin()}
      left={<TitleBarSlots slots={slots} />}
      maximized={isMaximized}
      fullscreen={isFullscreen}
      onFullscreenToggle={() => win.toggleFullscreen()}
      onMinimize={() => win.minimize()}
      onMaximizeToggle={() => win.toggleMaximize()}
      onClose={() => win.close()}
      concealed={hidden}
    />
  );
};

export { AppTitleBar };
