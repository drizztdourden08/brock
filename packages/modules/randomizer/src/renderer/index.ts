/* @layer renderer-shell @kind barrel */
import type { RendererModule } from '@drizztdourden08/brock-react';
import { randomizerBucket } from './bucket/randomizer-bucket';
import { flushMarksBeforeQuit } from './lifecycle/flush-marks-before-quit';
import { stopSessionBeforeQuit } from './lifecycle/before-quit';
import { RANDOMIZER_LOG_CHANNELS } from './lifecycle/log-channels.constants';
import { randomizerLockCause } from './lock/randomizer-lock-cause';
import { randomizerMode } from './mode/randomizer-mode';
import { connectionStep } from './online/connection-step/connection.step';
import { randomizerOnlineMode } from './online/online-mode';
import { checksWidgets } from './tracker/checks-widgets';
import { randomizerProfileHooks } from './profile-hooks/randomizer-profile-hooks';
import { randomizerOptionsStep } from './wizard/randomizer-options.step';
import { randomizerStep } from './wizard/randomizer.step';

const randomizerRenderer: RendererModule = {
  id: 'randomizer',
  buckets: [randomizerBucket],
  profileModes: [randomizerMode, randomizerOnlineMode],
  lockCauses: [randomizerLockCause],
  profileWizardSteps: [randomizerStep, randomizerOptionsStep, connectionStep],
  profileHooks: randomizerProfileHooks,
  logChannels: RANDOMIZER_LOG_CHANNELS,
  widgets: checksWidgets,
  beforeQuit: stopSessionBeforeQuit,
  onBeforeQuit: flushMarksBeforeQuit,
};

export default randomizerRenderer;
export { randomizerRenderer };
export { addRandomizerPages } from './bucket/add-randomizer-pages';
export { registerRandomizerGame } from './game-registry/register-randomizer-game';
export { useRandomizerGame } from './game-registry/behavior/useRandomizerGame';
export { useRandomizerSession } from './hooks/behavior/useRandomizerSession';
export { useTrackerFeed } from './tracker/hooks/behavior/useTrackerFeed';
export { useTrackerReading } from './tracker/hooks/behavior/useTrackerReading';
export { useTrackerMarks } from './tracker/marks/behavior/useTrackerMarks';
export { ChecksView } from './views/ChecksView';
export { useNetworkStatus } from './online/hooks/behavior/useNetworkStatus';
export { useRoomMessages } from './online/hooks/behavior/useRoomMessages';
export { useOnlineConnection } from './online/hooks/behavior/useOnlineConnection';
export { connectionStep };
export { NetworkView } from './views/NetworkView';
export { OnlineView } from './views/OnlineView';
export type { ChecksPrefs, ChecksViewProps } from './views/ChecksView';
export type { TrackerFeedInput } from './tracker/feed/tracker-feed-state.type';
