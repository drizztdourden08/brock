/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { instanceName } from '../../../../host/instance-name';
import { useCapability } from '../../../../platform/useCapability';
import { usePlatform } from '../../../../platform/usePlatform';
import { ScreenHost } from '../../../../screens/ScreenHost/ScreenHost';
import { useScreenRegistry } from '../../../../screens/useScreenRegistry';
import { BootProgressBar } from '../../../../shell/BootProgressBar/BootProgressBar';
import { ConfirmDialog } from '../../../../shell/ConfirmDialog/ConfirmDialog';
import { ScreenRail } from '../../../../shell/ScreenRail/ScreenRail';
import { TitleBar } from '../../../../shell/TitleBar/TitleBar';
import { useBrock } from '../../../useBrock';
import { buildMenu } from '../../behavior/build-menu';
import { stripScreenEntries } from '../../behavior/strip-screen-entries';
import { useIpcLogBridge } from '../../behavior/useIpcLogBridge';
import { useKeyboardShortcuts } from '../../behavior/useKeyboardShortcuts';
import { useProfileHydration } from '../../behavior/useProfileHydration';
import { useShellReady } from '../../behavior/useShellReady';
import { useStartup } from '../../behavior/useStartup';
import type { AppShellProps } from './AppShell.type';

const AppShell = <S extends object>(props: AppShellProps<S>) => {
  const { settingsStore, log, moduleMenu, titleBarSlots, instanceLogoSrc, layout = 'menu', screenGroups } = props;
  const { product, home, menu, logoSrc } = useBrock();
  const { window: win } = usePlatform();
  const windowChrome = useCapability('windowChrome');
  const registry = useScreenRegistry();
  const railed = layout === 'rail';

  const { settled } = useStartup();
  useShellReady(settled);
  useProfileHydration(settingsStore);
  useKeyboardShortcuts();
  useIpcLogBridge(log);

  const fullMenu = useMemo(() => {
    const built = buildMenu(menu, moduleMenu, () => win.close());
    return railed ? stripScreenEntries(built) : built;
  }, [menu, moduleMenu, win, railed]);

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
    </Box>
  );
};

export { AppShell };
