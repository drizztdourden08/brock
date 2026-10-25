/* @layer renderer-shell @kind component */
import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useDeveloperTools } from '../../app/useDeveloperTools';
import { RenderErrorBoundary } from '../../errors/RenderErrorBoundary';
import { LazyHost } from '../../lazy/LazyHost';
import { useBackTarget } from '../../navigation/useBackTarget';
import { useNavigation } from '../../navigation/useNavigation';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { useScreenRegistry } from '../useScreenRegistry';
import { isScreenAllowed } from '../is-screen-allowed';
import { useShowContext } from '../show/useShowContext';
import { ScreenStateScope } from '../screen-state-scope';
import type { ScreenDef, ScreenRenderContext } from '../screen.type';
import { ScreenLayer } from '../ScreenLayer/ScreenLayer';
import { freeFrameOf } from './behavior/free-frame-of';
import { isHubWindow } from './behavior/is-hub-window';
import { layerKeyOf } from './behavior/layer-key-of';
import { useMountedScreens } from './behavior/useMountedScreens';
import { screenScroll } from '../scroll/screen-scroll';
import type { ScreenHostProps } from './ScreenHost.type';
import './ScreenHost.css';

const scoped = (screen: ScreenDef, ctx: ScreenRenderContext): ReactNode => (
  <ScreenStateScope.Provider value={screen.id}><LazyHost>{screen.render(ctx)}</LazyHost></ScreenStateScope.Provider>
);

const covers = (shown: ScreenDef | null, home: string): boolean => shown !== null && shown.id !== home && shown.layer !== 'own';

const guarded = (screen: ScreenDef, hidden: boolean, ctx: ScreenRenderContext, onHome: () => void): ReactNode => (
  <RenderErrorBoundary key={screen.id} scope={`Screen ${screen.id}`} onHome={onHome} resetKey={hidden}>
    {scoped(screen, ctx)}
    <Box hidden data-screen-scroll={screen.id} />
  </RenderErrorBoundary>
);

const chromeOf = (screen: ScreenDef, ctx: ScreenRenderContext) =>
  (isHubWindow(screen) ? freeFrameOf(screen) : { subtitle: screen.subtitle?.(ctx), extra: screen.extra?.(ctx) });

const ScreenHost = (props: ScreenHostProps) => {
  const { home, square = false, className = 'screen-host', label } = props;
  const registry = useScreenRegistry();
  const { active: activeId, params, open, close, back } = useNavigation();
  const backTarget = useBackTarget();
  const profile = useProfilesStore((s) => s.active);
  const developerTools = useDeveloperTools();
  const show = useShowContext();

  const ctx = useMemo<ScreenRenderContext>(() => ({ params, profile, open, close }), [params, profile, open, close]);

  const allowed = (screen: ScreenDef | undefined): screen is ScreenDef => screen !== undefined && isScreenAllowed(screen, developerTools, profile !== null, show);

  const homeScreen = registry.get(home);
  const active = registry.get(activeId ?? '');
  const shown = allowed(active) ? active : null;
  const mounted = useMountedScreens(shown);
  useEffect(screenScroll.watch, []);

  const draw = (screen: ScreenDef, hidden: boolean): ReactNode => {
    if (screen.layer === 'own') return hidden ? null : <Box key={screen.id}>{guarded(screen, hidden, ctx, close)}</Box>;
    const backable = backTarget !== null && !hidden && !isHubWindow(screen);
    return (
      <ScreenLayer
        key={layerKeyOf(screen)}
        title={screen.title}
        icon={screen.icon}
        header={screen.header}
        size={screen.size}
        square={square}
        {...chromeOf(screen, ctx)}
        floating={screen.floating?.(ctx)}
        hidden={hidden}
        back={backable ? { onSelect: back, label: screen.title } : undefined}
        onClose={close}
      >
        {guarded(screen, hidden, ctx, close)}
      </ScreenLayer>
    );
  };

  const covered = covers(shown, home);

  return (
    <Box {...(label === undefined ? {} : { as: 'main' as const, 'aria-label': label })} className={className}>
      <Box className="screen-host__home">
        {allowed(homeScreen) && (
          <RenderErrorBoundary scope={`Screen ${homeScreen.id}`} resetKey={activeId}>
            {scoped(homeScreen, ctx)}
          </RenderErrorBoundary>
        )}
      </Box>
      {allowed(homeScreen) && covered && <Box className="screen-host__scrim" aria-hidden="true" />}
      {mounted.map((id) => {
        const screen = registry.get(id);
        return screen && id !== home ? draw(screen, shown?.id !== id) : null;
      })}
    </Box>
  );
};

export { ScreenHost };
