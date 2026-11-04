/* @layer renderer-shell @kind types */
import type { Block } from './block.type';
import type { SectionId } from './section-id.type';
import type { CoreSignal, GateSignal } from './signals.type';

interface GameInfoSection<S> {
  id: SectionId;
  title?: string;
  blocks: (snapshot: S) => Block[];
  compact?: (snapshot: S) => Block[];
  developer?: boolean;
}

interface GameInfoProvider<S> {
  core: CoreSignal;
  gate: GateSignal;
  read: () => S | null;
  sections: readonly GameInfoSection<S>[];
  emptyText?: string;
}

interface ProviderState {
  provider: GameInfoProvider<never> | null;
}

export type { GameInfoProvider, GameInfoSection, ProviderState };
