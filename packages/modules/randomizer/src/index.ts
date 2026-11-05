/* @layer core @kind barrel */
import './augment';

export { defineRandomizerGame } from './contract/define-randomizer-game';
export type { RandomizerGame } from './contract/randomizer-game.type';
export type { RandomizerViews, ChecksWidgetViews, OptionTab, OptionTabProps, ConnectionBodies, RunPanelDef, RunPanelProps, LogRule } from './contract/randomizer-views.type';
export type { InventoryArea, InventoryLayout, InventoryProvider, InventorySlot, InventoryWidgetSlot } from './contract/inventory.type';
export type { ConnectionBody, ConnectionView } from './contract/connection-view.type';
export type { RollContext } from './contract/roll-context.type';
export type { JoinedContext, RollJoined, RollOutcome } from './contract/roll-outcome.type';
export { joinedRoll } from './contract/joined-roll';
export { isJoinedRoll } from './contract/is-joined-roll';
export type { WorldStamp } from './contract/world-stamp.type';
export type { RandomizerPoll } from './contract/randomizer-poll.type';
export type { CoreSignal } from './contract/core-signal.type';
export type { RandomizerLog, RandomizerLogLine } from './contract/randomizer-log.type';
export type { PlacementSummary } from './contract/placement-summary.type';
export type { RandomizerGameMode } from './contract/randomizer-game-mode.type';
export type { RandomizerLabels } from './contract/randomizer-labels.type';
export type { RandomizerLogText } from './contract/randomizer-log-text.type';
export type { RandomizerFormState } from './contract/randomizer-form-state.type';
export type { ArchipelagoGame } from './contract/archipelago-game.type';
export type { ArchipeliaGame } from './contract/archipelia-game.type';
export type { ForeignItem } from './session/applier/foreign-item.type';
export type {
  ArchipelagoConnection,
  RandomizerConnectionValues,
  RandomizerModeId,
  RandomizerModes,
  RandomizerTypeRegistry,
  RandomizerOptions,
  RandomizerProfileOptions,
  RandomizerFrozenSettings,
  RandomizerProfileConfig,
} from './augment';
export { frozenKeysOf } from './profile/frozen-keys-of';
export type { OptionCatalog } from './world/options/option-catalog.type';
export type { OptionDef } from './world/options/option-def.type';
export type { OptionDetail, OptionImplementation, OptionKind, OptionRange } from './world/options/option-parts.type';
