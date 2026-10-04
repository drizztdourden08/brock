/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { instanceName } from '../../../../host/instance-name';
import { StandardOverlays } from '../../../../overlays/StandardOverlays/StandardOverlays';
import { useCapability } from '../../../../platform/useCapability';
import { ScreenHost } from '../../../../screens/ScreenHost/ScreenHost';
import { withoutActionEntries } from '../../../../shell/TitleBar/behavior/without-action-entries';
import { NO_ACTION_SOURCES } from '../../../../shell/TitleBar/TitleBar.constants';
import { useScreenRegistry } from '../../../../screens/useScreenRegistry';
import { useBrock } from '../../../useBrock';
import { WidgetHost } from '../../../../widgets/WidgetHost/WidgetHost';
import { WindowGuide } from '../../../../widgets/WindowGuide';
import { useWindowSquare } from '../../../../widgets/useWindowSquare';
import { BootFailureGate } from '../../../../boot/BootFailureGate';
import { useBootStore } from '../../../../boot/useBootStore';
import { useRendererBoot } from '../../../../boot/useRendererBoot';
import { useIpcLogBridge } from '../../behavior/useIpcLogBridge';
import { useKeyboardShortcuts } from '../../behavior/useKeyboardShortcuts';
import { useOpenHomeOnStart } from '../../behavior/useOpenHomeOnStart';
import { useProfileHydration } from '../../behavior/useProfileHydration';
import { useReviewTour } from '../../behavior/useReviewTour';
import { useSaveFailureToast } from '../../behavior/useSaveFailureToast';
import { useShellActions } from '../../behavior/useShellActions';
import { useShellMenu } from '../../behavior/useShellMenu';
import { useStandardEscapeLayers } from '../../behavior/useStandardEscapeLayers';
import { useTitleBarHidden } from '../../behavior/useTitleBarHidden';
import { NO_MODULE_IDS } from '../../BrockApp.constants';
import { AppRail } from '../AppRail';
import { AppTitleBar } from '../AppTitleBar';
import type { AppShellProps } from './AppShell.type';

const AppShell = <S extends object>(props: AppShellProps<S>) => {
  const { settingsStore, bootTasks, log, moduleIds = NO_MODULE_IDS, moduleMenu, titleBarActions = NO_ACTION_SOURCES, searchActions, widgets, layout = 'menu', screenGroups } = props;
  const { product, home, logoSrc } = useBrock();
  const windowChrome = useCapability('windowChrome');
  const registry = useScreenRegistry();
  const railed = layout === 'rail';

  const phase = useBootStore((s) => s.phase);
  useOpenHomeOnStart(phase === 'painting' || phase === 'ready');
  useRendererBoot(settingsStore, bootTasks);
  const ready = phase === 'ready';
  useProfileHydration(settingsStore);
  useSaveFailureToast(settingsStore);
  useKeyboardShortcuts();
  useStandardEscapeLayers();
  useIpcLogBridge(log);

  const fullMenu = useShellMenu(moduleMenu, railed);
  const actions = useShellActions(titleBarActions);
  const square = useWindowSquare();
  const actionIds = JSON.stringify(actions.map((action) => action.id));
  const barMenu = useMemo(() => withoutActionEntries(fullMenu, JSON.parse(actionIds) as string[]), [fullMenu, actionIds]);
  const titleBarHidden = useTitleBarHidden();
  useReviewTour({ ready, menu: barMenu, actions, moduleIds });

  const screens = useMemo(() => registry.list(), [registry]);
  const main = <BootFailureGate><ScreenHost home={home} square={square} className="brock-app__screens" /></BootFailureGate>;
  const stage = <WidgetHost widgets={widgets} mainLabel={product.widgets.mainLabel} main={main} />;

  return (
    <Box className="brock-app">
      {windowChrome && (
        <AppTitleBar
          title={product.window.title ?? product.name}
          menu={barMenu}
          controls={product.window.titleBar.controls}
          instanceName={instanceName()}
          logoSrc={logoSrc}
          actions={actions}
          hidden={titleBarHidden}
        />
      )}
      <Box className={`brock-app__content${railed ? ' brock-app__content--rail' : ''}`}>
        {railed && <AppRail screens={screens} home={home} groups={screenGroups} />}
        {railed ? <Box className="brock-app__stage">{stage}</Box> : stage}
      </Box>
      <WindowGuide />
      <StandardOverlays menu={fullMenu} actions={searchActions} />
    </Box>
  );
};

export { AppShell };
