/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { instanceName } from '../../../../host/instance-name';
import { StandardOverlays } from '../../../../overlays/StandardOverlays/StandardOverlays';
import { useCapability } from '../../../../platform/useCapability';
import { ScreenHost } from '../../../../screens/ScreenHost/ScreenHost';
import { useScreenRegistry } from '../../../../screens/useScreenRegistry';
import { ConfirmDialog } from '../../../../shell/ConfirmDialog/ConfirmDialog';
import { useBrock } from '../../../useBrock';
import { useBootStore } from '../../../../boot/useBootStore';
import { useRendererBoot } from '../../../../boot/useRendererBoot';
import { useIpcLogBridge } from '../../behavior/useIpcLogBridge';
import { useKeyboardShortcuts } from '../../behavior/useKeyboardShortcuts';
import { useOpenHomeOnStart } from '../../behavior/useOpenHomeOnStart';
import { useProfileHydration } from '../../behavior/useProfileHydration';
import { useReviewTour } from '../../behavior/useReviewTour';
import { useShellMenu } from '../../behavior/useShellMenu';
import { useStandardEscapeLayers } from '../../behavior/useStandardEscapeLayers';
import { useTitleBarHidden } from '../../behavior/useTitleBarHidden';
import { NO_MODULE_IDS } from '../../BrockApp.constants';
import { AppRail } from '../AppRail';
import { AppTitleBar } from '../AppTitleBar';
import type { AppShellProps } from './AppShell.type';

const AppShell = <S extends object>(props: AppShellProps<S>) => {
  const { settingsStore, bootTasks, log, moduleIds = NO_MODULE_IDS, moduleMenu, titleBarSlots, searchActions, widgets, layout = 'menu', screenGroups } = props;
  const { product, home, logoSrc, instanceLogoSrc } = useBrock();
  const windowChrome = useCapability('windowChrome');
  const registry = useScreenRegistry();
  const railed = layout === 'rail';

  const phase = useBootStore((s) => s.phase);
  useOpenHomeOnStart(phase === 'painting' || phase === 'ready');
  useRendererBoot(settingsStore, bootTasks);
  const ready = phase === 'ready';
  useProfileHydration(settingsStore);
  useKeyboardShortcuts();
  useStandardEscapeLayers();
  useIpcLogBridge(log);

  const fullMenu = useShellMenu(moduleMenu, railed);
  const titleBarHidden = useTitleBarHidden();
  useReviewTour({ ready, menu: fullMenu, slots: titleBarSlots, moduleIds });

  const screens = useMemo(() => registry.list(), [registry]);

  return (
    <Box className="brock-app">
      {windowChrome && (
        <AppTitleBar
          title={product.window.title ?? product.name}
          menu={fullMenu}
          instanceName={instanceName()}
          logoSrc={logoSrc}
          instanceLogoSrc={instanceLogoSrc}
          slots={titleBarSlots}
          hidden={titleBarHidden}
        />
      )}
      <Box className={`brock-app__content${railed ? ' brock-app__content--rail' : ''}`}>
        {railed && <AppRail screens={screens} home={home} groups={screenGroups} />}
        {railed
          ? <Box className="brock-app__stage"><ScreenHost home={home} className="brock-app__screens" /></Box>
          : <ScreenHost home={home} className="brock-app__screens" />}
      </Box>
      <ConfirmDialog />
      <StandardOverlays menu={fullMenu} actions={searchActions} widgets={widgets} />
    </Box>
  );
};

export { AppShell };
