/* @layer renderer-shell @kind barrel */
export { DEFAULT_REFRESH_HZ, DEFAULT_SECTION_IDS, GAME_INFO_WIDGET_ID, REFRESH_CHOICES, SECTION_IDS } from './game-info.constants';
export type {
  Block, AppRenderedBlock, InfoBar, InfoListItem, InfoMember, InfoProgressItem, InfoRow, InfoValue, ListBlock, MembersBlock, ProgressBlock, RowsBlock,
} from './provider/block.type';
export type { GameInfoProvider, GameInfoSection } from './provider/provider.type';
export type { SectionId } from './provider/section-id.type';
export type { CoreSignal, GateSignal } from './provider/signals.type';
export { provideGameInfo } from './provider/provide-game-info';
export { useProviderStore } from './provider/useProviderStore';
export { GAME_INFO_PREFS } from './settings/game-info-prefs.constants';
export type { GameInfoPublish, GameInfoState, SectionBlocks } from './store/game-info-state.type';
export { useGameInfoStore } from './store/useGameInfoStore';
export { startGameInfoRuntime } from './runtime/start-poller';
export { useGameInfoDisabled } from './runtime/useGameInfoDisabled';
export { useGameInfoView } from './runtime/useGameInfoView';
export type { GameInfoView } from './runtime/game-info-view.type';
