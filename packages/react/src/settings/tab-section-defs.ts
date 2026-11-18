/* @layer renderer-shell @kind logic */
import type { SectionDef, TabDef } from './settings.type';

const tabSectionDefs = <S extends object>(tab: TabDef<S>, settings: S): SectionDef[] => {
  const sections = tab.sections?.(settings) ?? [];
  const { source } = tab;
  return source === undefined ? sections : sections.map((section) => (section.source === undefined ? { ...section, source } : section));
};

export { tabSectionDefs };
