/* @layer renderer-shell @kind logic */
import type { Section, TabDef } from './settings.type';

const tabSections = <S extends object>(tab: TabDef<S>, settings: S): Section[] => {
  const sections = tab.sections?.(settings) ?? [];
  const { source } = tab;
  return source === undefined ? sections : sections.map((section) => (section.source === undefined ? { ...section, source } : section));
};

export { tabSections };
