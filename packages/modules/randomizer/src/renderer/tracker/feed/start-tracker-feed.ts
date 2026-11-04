/* @layer renderer-shell @kind logic */
import { checkSignal, useSessionStore } from '../../../session';
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import { useTrackerMarksStore } from '../marks/behavior/useTrackerMarksStore';
import { followProfileMarks } from '../marks/follow-profile-marks';
import { useTrackerFeedStore } from './behavior/useTrackerFeedStore';
import { bindGameSignals } from './bind-game-signals';
import { buildFeedInput } from './build-feed-input';
import { sampleChecks } from './sample-checks';
import { samplerWanted } from './sampler-wanted';
import { startSampler } from './start-sampler';
import { NO_KEYS } from './tracker-feed.constants';
import type { FeedRun, FeedWiring } from './tracker-feed-state.type';

const unbound = (): void => undefined;

const startTrackerFeed = (): (() => void) => {
  const run: FeedRun = { view: null, sampled: NO_KEYS };
  const wiring: FeedWiring = { game: null, unbindGame: unbound, stopSampler: null };

  const refresh = (): void => {
    const { game } = useRandomizerGameStore.getState();
    const marks = useTrackerMarksStore.getState().marks;
    const input = game === null ? null : buildFeedInput({ game, view: run.view, sampled: run.sampled, marks });
    useTrackerFeedStore.getState().publish(input);
  };

  const sample = (): void => {
    const { game } = useRandomizerGameStore.getState();
    const tracker = game?.tracker;
    if (game === null || tracker === undefined) return;
    Object.assign(run, sampleChecks(game, tracker));
    refresh();
  };

  const syncSampler = (): void => {
    const wanted = samplerWanted(useRandomizerGameStore.getState().game);
    if (wanted && wiring.stopSampler === null) {
      run.sampled = NO_KEYS;
      wiring.stopSampler = startSampler(sample);
    }
    if (!wanted && wiring.stopSampler !== null) {
      wiring.stopSampler();
      wiring.stopSampler = null;
    }
  };

  const onChange = (): void => {
    refresh();
    syncSampler();
  };

  const onGame = (): void => {
    const { game } = useRandomizerGameStore.getState();
    if (game !== wiring.game) {
      wiring.unbindGame();
      wiring.game = game;
      wiring.unbindGame = game === null ? unbound : bindGameSignals(game, onChange);
    }
    onChange();
  };

  const stops = [
    useSessionStore.subscribe(onChange),
    useRandomizerGameStore.subscribe(onGame),
    useTrackerMarksStore.subscribe(refresh),
    checkSignal.subscribe((view) => {
      run.view = view;
      onChange();
    }),
    followProfileMarks(),
  ];
  onGame();

  return () => {
    for (const stop of stops) stop();
    wiring.unbindGame();
    wiring.stopSampler?.();
  };
};

export { startTrackerFeed };
