/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { WindowMascot } from '../../../../brand/WindowMascot';
import { instanceName } from '../../../../host/instance-name';
import { StandardOverlays } from '../../../../overlays/StandardOverlays/StandardOverlays';
import { ScreenHost } from '../../../../screens/ScreenHost/ScreenHost';
import { withoutActionEntries } from '../../../../shell/TitleBar/behavior/without-action-entries';
import { NO_ACTION_SOURCES } from '../../../../shell/TitleBar/TitleBar.constants';
import { useScreenRegistry } from '../../../../screens/useScreenRegistry';
import { useBrock } from '../../../useBrock';
import { WidgetHost } from '../../../../widgets/WidgetHost/WidgetHost';
import { WindowGuide } from '../../../../widgets/WindowGuide';
import { useWindowSquare } from '../../../../widgets/useWindowSquare';
import { BootFailureSplash } from '../../../../boot/BootFailureSplash';
import { BootGate } from '../../../../boot/BootGate';
import { useBootStore } from '../../../../boot/useBootStore';
import { useRendererBoot } from '../../../../boot/useRendererBoot';
import { useIpcLogBridge } from '../../behavior/useIpcLogBridge';
import { useKeyboardShortcuts } from '../../behavior/useKeyboardShortcuts';
import { useMouseBack } from '../../behavior/useMouseBack';
import { useOpenHomeOnStart } from '../../behavior/useOpenHomeOnStart';
import { useProfileHydration } from '../../behavior/useProfileHydration';
import { useReviewTour } from '../../behavior/useReviewTour';
import { useSaveFailureToast } from '../../behavior/useSaveFailureToast';
import { useProfileViews } from '../../behavior/useProfileViews';
import { useShellActions } from '../../behavior/useShellActions';
import { useShellMenu } from '../../behavior/useShellMenu';
import { viewHidden } from '../../../../menu/view-hidden';
import { useTitleBarHidden } from '../../behavior/useTitleBarHidden';
import { useTitleBarShown } from '../../behavior/useTitleBarShown';
import { NO_MODULE_IDS } from '../../BrockApp.constants';
import { useBarControls } from '../../behavior/useBarControls';
import { AppRail } from '../AppRail';
import { AppTitleBar } from '../AppTitleBar';
import { JobHost } from '../../../../jobs/JobHost';
import { TourHost } from '../../../../tours/TourHost';
import { useAppOpenBridge } from '../../../../open/useAppOpenBridge';
import { useBootPreload } from '../../../../lazy/useBootPreload';
import type { AppShellProps } from './AppShell.type';

const AppShell = <S extends object>(props: AppShellProps<S>) => {
  const { settingsStore, bootTasks, log, moduleIds = NO_MODULE_IDS, moduleMenu, titleBarActions = NO_ACTION_SOURCES, searchActions, widgets, widgetKits, widgetLayout, widgetContext, widgetDisabled, layout = 'menu', screenGroups, review, volume, restoreNavigation } = props;
  const { product, home, homeScreen, logoSrc } = useBrock();
  const titleBar = useTitleBarShown(product.window.titleBar.mobile);
  const controls = useBarControls(product.window.titleBar.controls);
  const registry = useScreenRegistry();
  const railed = layout === 'rail';

  const phase = useBootStore((s) => s.phase);
  const failure = useBootStore((s) => (s.phase === 'failed' ? s.failure : null));
  useOpenHomeOnStart(phase === 'painting' || phase === 'ready');
  useRendererBoot(settingsStore, bootTasks);
  const ready = phase === 'ready';
  useProfileHydration(settingsStore);
  useSaveFailureToast(settingsStore);
  useKeyboardShortcuts();
  useMouseBack();
  useProfileViews(settingsStore, volume, restoreNavigation);
  useIpcLogBridge(log);
  useAppOpenBridge();

  const hideView = viewHidden(product.menu);
  const shellMenu = useShellMenu(moduleMenu, railed);
  useBootPreload(registry, [home, homeScreen]);
  const actions = useShellActions(titleBarActions);
  const square = useWindowSquare();
  const actionIds = JSON.stringify(actions.map((action) => action.id));
  const barMenu = useMemo(() => withoutActionEntries(shellMenu.menu, JSON.parse(actionIds) as string[]), [shellMenu.menu, actionIds]);
  const titleBarHidden = useTitleBarHidden();
  useReviewTour({ ready, menu: barMenu, menuOverrides: shellMenu.overrides, actions, moduleIds, review });

  const screens = useMemo(() => registry.list(), [registry]);
  const main = <BootGate><ScreenHost home={home} square={square} className="brock-app__screens" /></BootGate>;
  const stage = <WidgetHost widgets={widgets} widgetKits={widgetKits} layout={widgetLayout} widgetContext={widgetContext} widgetDisabled={widgetDisabled} mainLabel={product.widgets.mainLabel} keepFocusWithApp={product.widgets.keepFocusWithApp} main={main} />;

  return (
    <>
      <Box className="brock-app" inert={failure !== null}>
        {titleBar && (
          <AppTitleBar
            title={product.window.title ?? product.name}
            menu={barMenu}
            controls={controls}
            instanceName={instanceName()}
            logoSrc={logoSrc}
            actions={actions}
            hidden={titleBarHidden}
            viewHidden={hideView}
            menuConfig={product.menu}
          />
        )}
        <Box className={`brock-app__content${railed ? ' brock-app__content--rail' : ''}`}>
          {railed && <AppRail screens={screens} home={home} groups={screenGroups} />}
          {railed ? <Box className="brock-app__stage">{stage}</Box> : stage}
        </Box>
        <WindowMascot />
        <WindowGuide />
        <JobHost />
        <StandardOverlays menu={shellMenu.searchable} actions={searchActions} />
        <TourHost ready={ready} />
      </Box>
      <BootFailureSplash failure={failure} />
    </>
  );
};

export { AppShell };
