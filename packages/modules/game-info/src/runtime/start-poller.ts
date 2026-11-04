/* @layer renderer-shell @kind logic */
import { useWidgetPrefStore, widgets, widgetWindowId } from '@drizztdourden08/brock-react';
import { GAME_INFO_WIDGET_ID } from '../game-info.constants';
import { useProviderStore } from '../provider/useProviderStore';
import { useGameInfoStore } from '../store/useGameInfoStore';
import { pollOnce } from './poll-once';
import { shouldPoll } from './poll-conditions';
import { readRefreshHz } from './read-prefs';
import { shareGameInfo } from './share-game-info';

const noop = (): void => undefined;

const wantsPolling = (): boolean => {
  const provider = useProviderStore.getState().provider;
  return provider !== null && shouldPoll({
    coreStatus: provider.core.state().status,
    gate: provider.gate.get(),
    visible: widgets.isVisible(GAME_INFO_WIDGET_ID),
  });
};

const startGameInfoRuntime = (): (() => void) => {
  if (widgetWindowId() !== null) return noop;
  let timer: ReturnType<typeof setInterval> | null = null;
  let activeHz = 0;
  let providerOffs: (() => void)[] = [];
  let attached: unknown = null;

  const halt = (): void => {
    if (timer !== null) clearInterval(timer);
    timer = null;
    activeHz = 0;
  };

  const evaluate = (): void => {
    const hz = readRefreshHz();
    const on = wantsPolling();
    if (on && timer !== null && hz === activeHz) return;
    halt();
    useGameInfoStore.getState().setRunning(on);
    if (!on) return;
    activeHz = hz;
    pollOnce();
    timer = setInterval(pollOnce, 1000 / hz);
  };

  const attach = (): void => {
    const provider = useProviderStore.getState().provider;
    if (provider === attached) return;
    attached = provider;
    providerOffs.forEach((off) => off());
    providerOffs = provider === null ? [] : [provider.core.subscribe(evaluate), provider.gate.subscribe(evaluate)];
  };

  const offs = [
    useProviderStore.subscribe(() => { attach(); evaluate(); }),
    useWidgetPrefStore.subscribe((state, prev) => {
      if (state.byWidget[GAME_INFO_WIDGET_ID] !== prev.byWidget[GAME_INFO_WIDGET_ID]) evaluate();
    }),
    widgets.subscribe(evaluate),
    shareGameInfo(),
  ];
  attach();
  evaluate();

  return () => {
    halt();
    providerOffs.forEach((off) => off());
    offs.forEach((off) => off());
    useGameInfoStore.getState().reset();
  };
};

export { startGameInfoRuntime };
