/* @layer core @kind types */
import type { ApStateStore } from '../session/received/ap-state-store.type';
import type { FrameClock } from '../session/delivery/frame-clock.type';
import type { ItemDeliverer } from '../session/delivery/item-deliverer.type';
import type { SeedApplier } from '../session/applier/seed-applier.type';
import type { MemoryBridge } from '../memory/memory-bridge.type';
import type { RandomizerProfileConfig } from '../augment';
import type { DefPlacement, RandomizerWorldGame, SchemaSet } from '../world';
import type { OptionCatalog } from '../world/options/option-catalog.type';
import type { CoreSignal } from './core-signal.type';
import type { PlacementSummary } from './placement-summary.type';
import type { RandomizerFormState } from './randomizer-form-state.type';
import type { RandomizerLabels } from './randomizer-labels.type';
import type { RandomizerViews } from './randomizer-views.type';

type RandomizerGame<P = DefPlacement, A = unknown> = {
  id: string;
  world: RandomizerWorldGame;
  placementSchemas: SchemaSet;
  core: CoreSignal;
  roll: (config: RandomizerProfileConfig) => P;
  describe: (placement: P) => PlacementSummary;
  isPlacement?: (raw: unknown) => raw is P;
  memory: MemoryBridge;
  applier: SeedApplier<P, A>;
  deliverer?: ItemDeliverer<A>;
  apState?: ApStateStore;
  frames?: FrameClock;
  poll?: { intervalMs?: number; completed?: () => ReadonlySet<string>; beforePoll?: () => void };
  profile: { toConfig: (form: RandomizerFormState, options: unknown) => RandomizerProfileConfig };
  catalog?: OptionCatalog;
  views?: RandomizerViews;
  labels?: Partial<RandomizerLabels>;
};

export type { RandomizerGame };
