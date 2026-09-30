/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { instanceName } from '../../../../host/instance-name';
import { StandardOverlays } from '../../../../overlays/StandardOverlays/StandardOverlays';
import { useCapability } from '../../../../platform/useCapability';
import { ScreenHost } from '../../../../screens/ScreenHost/ScreenHost';
import { useScreenRegistry } from '../../../../screens/useScreenRegistry';
import { BootProgressBar } from '../../../../shell/BootProgressBar/BootProgressBar';
import { ConfirmDialog } from '../../../../shell/ConfirmDialog/ConfirmDialog';
import { ScreenRail } from '../../../../shell/ScreenRail/ScreenRail';
import { TitleBar } from '../../../../shell/TitleBar/TitleBar';
import { useBrock } from '../../../useBrock';
import { useIpcLogBridge } from '../../behavior/useIpcLogBridge';
import { useKeyboardShortcuts } from '../../behavior/useKeyboardShortcuts';
import { useProfileHydration } from '../../behavior/useProfileHydration';
import { useReviewTour } from '../../behavior/useReviewTour';
import { useShellMenu } from '../../behavior/useShellMenu';
import { useShellReady } from '../../behavior/useShellReady';
import { useStandardEscapeLayers } from '../../behavior/useStandardEscapeLayers';
import { useStartup } from '../../behavior/useStartup';
import { useTitleBarHidden } from '../../behavior/useTitleBarHidden';
import { NO_MODULE_IDS } from '../../BrockApp.constants';
import type { AppShellProps } from './AppShell.type';

const AppShell = <S extends object>(props: AppShellProps<S>) => {
  const { settingsStore, log, moduleIds = NO_MODULE_IDS, moduleMenu, titleBarSlots, searchActions, widgets, layout = 'menu', screenGroups } = props;
  const { product, home, logoSrc, instanceLogoSrc } = useBrock();
  const windowChrome = useCapability('windowChrome');
  const registry = useScreenRegistry();
  const railed = layout === 'rail';

  const { settled } = useStartup();
  useShellReady(settled);
  useProfileHydration(settingsStore);
  useKeyboardShortcuts();
  useStandardEscapeLayers();
  useIpcLogBridge(log);

  const fullMenu = useShellMenu(moduleMenu, railed);
  const titleBarHidden = useTitleBarHidden();
  useReviewTour({ settled, menu: fullMenu, slots: titleBarSlots, moduleIds });

  const screens = useMemo(() => registry.list(), [registry]);

  return (
    <Box className="brock-app">
      {windowChrome && (
        <TitleBar
          productName={product.window.title ?? product.name}
          menu={fullMenu}
          instanceName={instanceName()}
          logoSrc={logoSrc}
          instanceLogoSrc={instanceLogoSrc}
          slots={titleBarSlots}
          hidden={titleBarHidden}
        />
      )}
      <Box className={`brock-app__content${railed ? ' brock-app__content--rail' : ''}`}>
        {railed && <ScreenRail screens={screens} home={home} groups={screenGroups} />}
        {railed
          ? <Box className="brock-app__stage"><ScreenHost home={home} className="brock-app__screens" /></Box>
          : <ScreenHost home={home} className="brock-app__screens" />}
      </Box>
      <ConfirmDialog />
      <BootProgressBar />
      <StandardOverlays menu={fullMenu} actions={searchActions} widgets={widgets} />
    </Box>
  );
};

export { AppShell };
