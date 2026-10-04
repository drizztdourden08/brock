/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useDeveloperTools } from '../../app/useDeveloperTools';
import { RenderErrorBoundary } from '../../errors/RenderErrorBoundary';
import { useNavigation } from '../../navigation/useNavigation';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { useScreenRegistry } from '../useScreenRegistry';
import { isScreenAllowed } from '../is-screen-allowed';
import type { ScreenDef, ScreenRenderContext } from '../screen.type';
import { ScreenLayer } from '../ScreenLayer/ScreenLayer';
import { useMountedScreens } from './behavior/useMountedScreens';
import type { ScreenHostProps } from './ScreenHost.type';
import './ScreenHost.css';

const ScreenHost = (props: ScreenHostProps) => {
  const { home, square = false, className = 'screen-host' } = props;
  const registry = useScreenRegistry();
  const { active: activeId, params, open, close } = useNavigation();
  const profile = useProfilesStore((s) => s.active);
  const developerTools = useDeveloperTools();

  const ctx = useMemo<ScreenRenderContext>(() => ({ params, profile, open, close }), [params, profile, open, close]);

  const allowed = (screen: ScreenDef | undefined): screen is ScreenDef =>
    screen !== undefined && isScreenAllowed(screen, developerTools, profile !== null);

  const homeScreen = registry.get(home);
  const active = registry.get(activeId ?? '');
  const shown = allowed(active) ? active : null;
  const mounted = useMountedScreens(shown);

  const guarded = (screen: ScreenDef, hidden: boolean): ReactNode => (
    <RenderErrorBoundary scope={`Screen ${screen.id}`} onHome={close} resetKey={hidden}>{screen.render(ctx)}</RenderErrorBoundary>
  );

  const draw = (screen: ScreenDef, hidden: boolean): ReactNode => {
    if (screen.layer === 'own') return hidden ? null : <Box key={screen.id}>{guarded(screen, hidden)}</Box>;
    return (
      <ScreenLayer
        key={screen.id}
        title={screen.title}
        icon={screen.icon}
        header={screen.header}
        square={square}
        subtitle={screen.subtitle?.(ctx)}
        extra={screen.extra?.(ctx)}
        floating={screen.floating?.(ctx)}
        hidden={hidden}
        onClose={close}
      >
        {guarded(screen, hidden)}
      </ScreenLayer>
    );
  };

  const covered = shown !== null && shown.id !== home && shown.layer !== 'own';

  return (
    <Box className={className}>
      <Box className="screen-host__home" inert={covered || undefined}>
        {allowed(homeScreen) && (
          <RenderErrorBoundary scope={`Screen ${homeScreen.id}`} resetKey={activeId}>{homeScreen.render(ctx)}</RenderErrorBoundary>
        )}
      </Box>
      {mounted.map((id) => {
        const screen = registry.get(id);
        return screen && id !== home ? draw(screen, shown?.id !== id) : null;
      })}
    </Box>
  );
};

export { ScreenHost };
