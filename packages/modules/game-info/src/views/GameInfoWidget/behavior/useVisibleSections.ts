/* @layer renderer-shell @kind hook */
import { useProviderStore } from '../../../provider/useProviderStore';
import type { SectionBlocks } from '../../../store/game-info-state.type';
import type { GameInfoPrefsValue, VisibleSection } from '../GameInfoWidget.type';

const titleOf = (id: string, title?: string) => title ?? `${id.charAt(0).toUpperCase()}${id.slice(1)}`;

const useVisibleSections = (
  prefs: GameInfoPrefsValue,
  blocks: SectionBlocks,
  compact: SectionBlocks,
): VisibleSection[] => {
  const provider = useProviderStore((s) => s.provider);
  const compactView = prefs.view === 'compact';
  const sections: VisibleSection[] = [];
  for (const section of provider?.sections ?? []) {
    if (!prefs.sections.includes(section.id)) continue;
    const list = (compactView ? compact[section.id] : undefined) ?? blocks[section.id];
    if (list) sections.push({ id: section.id, title: titleOf(section.id, section.title), blocks: list });
  }
  return sections;
};

export { useVisibleSections };
