/* @layer renderer-shell @kind logic */
import type { GameInfoProvider } from '../provider/provider.type';
import type { SectionId } from '../provider/section-id.type';
import type { SectionBlocks } from '../store/game-info-state.type';

interface BuiltSections {
  blocks: SectionBlocks;
  compact: SectionBlocks;
}

const buildSections = (provider: GameInfoProvider<unknown>, snapshot: unknown, enabled: readonly SectionId[]): BuiltSections => {
  const built: BuiltSections = { blocks: {}, compact: {} };
  provider.sections.filter((section) => enabled.includes(section.id)).forEach((section) => {
    const full = section.blocks(snapshot);
    built.blocks[section.id] = full;
    built.compact[section.id] = section.compact?.(snapshot) ?? full;
  });
  return built;
};

export { buildSections };
export type { BuiltSections };
