/* @layer renderer-shell @kind types */
import type { Block } from '../../provider/block.type';
import type { SectionId } from '../../provider/section-id.type';

interface GameInfoPrefsValue {
  view: string;
  hexIds: boolean;
  hideSpoilers: boolean;
  sections: readonly string[];
}

interface VisibleSection {
  id: SectionId;
  title: string;
  blocks: Block[];
}

interface SectionViewProps {
  sections: readonly VisibleSection[];
  prefs: GameInfoPrefsValue;
  customDropped: boolean;
}

interface BlockViewProps {
  block: Block;
  prefs: GameInfoPrefsValue;
}

export type { BlockViewProps, GameInfoPrefsValue, SectionViewProps, VisibleSection };
