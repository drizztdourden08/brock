/* @layer renderer-shell @kind logic */
import type { Block } from '../provider/block.type';
import type { SectionId } from '../provider/section-id.type';
import type { SectionBlocks } from '../store/game-info-state.type';

const blockKey = (block: Block): unknown => (block.kind === 'custom' ? { kind: 'custom' } : block);

const sectionKey = (blocks: Block[] | undefined): string => (blocks === undefined ? '' : JSON.stringify(blocks.map(blockKey)));

const diffSections = (prev: SectionBlocks, next: SectionBlocks, prevCompact: SectionBlocks = {}, nextCompact: SectionBlocks = {}): SectionId[] => {
  const ids = new Set<SectionId>([...(Object.keys(prev) as SectionId[]), ...(Object.keys(next) as SectionId[])]);
  const differs = (id: SectionId): boolean =>
    sectionKey(prev[id]) !== sectionKey(next[id]) || sectionKey(prevCompact[id]) !== sectionKey(nextCompact[id]);
  return [...ids].filter(differs);
};

export { diffSections };
