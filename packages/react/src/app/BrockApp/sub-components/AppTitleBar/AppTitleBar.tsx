/* @layer renderer-shell @kind component */
import { WindowTitleBar } from '@drizztdourden08/tessera/composites';
import { useTitleBar } from '../../../../shell/TitleBar/behavior/useTitleBar';
import { useTitleBarMenu } from '../../../../shell/TitleBar/behavior/useTitleBarMenu';
import { useWindowControl } from '../../../../shell/TitleBar/behavior/useWindowControl';
import { TitleBarSlots } from '../../../../shell/TitleBar/sub-components/TitleBarSlots';
import { MENU_LABEL } from './AppTitleBar.constants';
import type { AppTitleBarProps } from './AppTitleBar.type';

const AppTitleBar = (props: AppTitleBarProps) => {
  const { title, menu, controls, instanceName, logoSrc, instanceLogoSrc, slots, hidden } = props;
  const { isMaximized, isFullscreen } = useTitleBar();
  const { pinned, onControl } = useWindowControl();
  const groups = useTitleBarMenu(menu);

  return (
    <WindowTitleBar
      title={title}
      logo={logoSrc}
      instance={instanceName ? { name: instanceName, logo: instanceLogoSrc } : null}
      menu={groups}
      menuLabel={MENU_LABEL}
      controls={controls}
      pinned={pinned}
      maximized={isMaximized}
      fullscreen={isFullscreen}
      onControl={onControl}
      left={<TitleBarSlots slots={slots} />}
      concealed={hidden}
    />
  );
};

export { AppTitleBar };
