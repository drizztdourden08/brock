/* @layer renderer-shell @kind component */
import { WindowTitleBar } from '@drizztdourden08/tessera/composites';
import { useTitleBar } from '../../../../shell/TitleBar/behavior/useTitleBar';
import { useTitleBarMenu } from '../../../../shell/TitleBar/behavior/useTitleBarMenu';
import { useWindowControl } from '../../../../shell/TitleBar/behavior/useWindowControl';
import { NO_ACTIONS } from '../../../../shell/TitleBar/TitleBar.constants';
import { MENU_LABEL, TITLE_BAR_CLASS } from './AppTitleBar.constants';
import type { AppTitleBarProps } from './AppTitleBar.type';

const AppTitleBar = (props: AppTitleBarProps) => {
  const { title, menu, controls, instanceName, logoSrc, actions = NO_ACTIONS, hidden, viewHidden = false } = props;
  const { isMaximized, isFullscreen } = useTitleBar();
  const { pinned, onControl } = useWindowControl();
  const { groups, view } = useTitleBarMenu(menu);

  return (
    <WindowTitleBar
      title={title}
      logo={logoSrc}
      instance={instanceName ? { name: instanceName } : null}
      menu={groups}
      menuLabel={MENU_LABEL}
      view={viewHidden ? false : view}
      actions={actions}
      controls={controls}
      pinned={pinned}
      maximized={isMaximized}
      fullscreen={isFullscreen}
      onControl={onControl}
      concealed={hidden}
      className={TITLE_BAR_CLASS}
    />
  );
};

export { AppTitleBar };
