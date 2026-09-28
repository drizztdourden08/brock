/* @layer renderer-shell @kind component */
import { useMemo, useRef } from 'react';
import { Box, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { useNavigation } from '../../navigation/useNavigation';
import { toDropdownItems } from '../../menu/to-dropdown-items';
import { titleBarClassName } from './behavior/title-bar-class';
import { usePeek } from './behavior/usePeek';
import { usePinWindow } from './behavior/usePinWindow';
import { useTitleBar } from './behavior/useTitleBar';
import { PinButton } from './sub-components/PinButton';
import { TitleBarBrand } from './sub-components/TitleBarBrand';
import { WindowControls } from './sub-components/WindowControls';
import { NO_MENU } from './TitleBar.constants';
import type { TitleBarProps } from './TitleBar.type';
import './TitleBar.css';

const TitleBar = (props: TitleBarProps) => {
  const {
    productName, menu = NO_MENU, instanceName = null, logoSrc, instanceLogoSrc, extra,
    hidden = false, showPin = true, className = '',
  } = props;
  const barRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const { open } = useNavigation();
  const { isMaximized, isFullscreen, menuOpen, toggleMenu, closeMenu } = useTitleBar(menuRef);
  const concealed = hidden || isFullscreen;
  const { peeking, handleMouseLeave } = usePeek(concealed, barRef);
  const { pinned, togglePin } = usePinWindow();

  const items = useMemo(() => toDropdownItems(menu, { closeMenu, openScreen: open }), [menu, closeMenu, open]);

  return (
    <Box ref={barRef} className={titleBarClassName(concealed, menuOpen, peeking, className)} onMouseLeave={handleMouseLeave}>
      <Box className="titlebar__left" ref={menuRef}>
        {menu.length > 0 && (
          <IconButton variant="ghost" size="sm" label="Menu" onClick={toggleMenu} active={menuOpen}>
            <Icon name="ellipsis-vertical" />
          </IconButton>
        )}
        {showPin && <PinButton pinned={pinned} onToggle={togglePin} />}
        {extra}
        {menuOpen && <DropdownMenu items={items} anchorRef={menuRef} />}
      </Box>

      <TitleBarBrand
        productName={productName}
        instanceName={instanceName}
        logoSrc={logoSrc}
        instanceLogoSrc={instanceLogoSrc}
      />

      <WindowControls isMaximized={isMaximized} isFullscreen={isFullscreen} />
    </Box>
  );
};

export { TitleBar };
