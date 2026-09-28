/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useNavigation } from '../../navigation/useNavigation';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { usePlatform } from '../../platform/usePlatform';
import { useScreenRegistry } from '../useScreenRegistry';
import type { ScreenDef, ScreenRenderContext } from '../screen.type';
import { ScreenLayer } from '../ScreenLayer/ScreenLayer';
import { useMountedScreens } from './behavior/useMountedScreens';
import type { ScreenHostProps } from './ScreenHost.type';

const ScreenHost = (props: ScreenHostProps) => {
  const { home, className = 'screen-host' } = props;
  const registry = useScreenRegistry();
  const { active: activeId, params, open, close } = useNavigation();
  const profile = useProfilesStore((s) => s.active);
  const { info } = usePlatform();

  const ctx = useMemo<ScreenRenderContext>(() => ({ params, profile, open, close }), [params, profile, open, close]);

  const allowed = (screen: ScreenDef | undefined): screen is ScreenDef =>
    screen !== undefined
    && (!screen.devOnly || info.isDev)
    && (screen.requiresProfile === false || profile !== null);

  const homeScreen = registry.get(home);
  const active = registry.get(activeId ?? '');
  const shown = allowed(active) ? active : null;
  const mounted = useMountedScreens(shown);

  const draw = (screen: ScreenDef, hidden: boolean): ReactNode => {
    if (screen.layer === 'own') return hidden ? null : <Box key={screen.id}>{screen.render(ctx)}</Box>;
    return (
      <ScreenLayer
        key={screen.id}
        title={screen.title}
        subtitle={screen.subtitle?.(ctx)}
        hidden={hidden}
        onClose={close}
      >
        {screen.render(ctx)}
      </ScreenLayer>
    );
  };

  return (
    <Box className={className}>
      {allowed(homeScreen) && homeScreen.render(ctx)}
      {mounted.map((id) => {
        const screen = registry.get(id);
        return screen && id !== home ? draw(screen, shown?.id !== id) : null;
      })}
    </Box>
  );
};

export { ScreenHost };
