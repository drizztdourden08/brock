/* @layer renderer-shell @kind logic */
import type { TabDef } from '../settings.type';
import { tabSections } from '../tab-sections';
import type { FoundSetting } from './find-setting.type';

const findSetting = (tabs: readonly TabDef<object>[], settings: object, key: string): FoundSetting | null => {
  for (const tab of tabs) {
    for (const section of tabSections(tab, settings)) {
      const items = [...(section.items ?? []), ...(section.subsections ?? []).flatMap((sub) => sub.items)];
      const item = items.find((candidate) => candidate.key === key);
      if (item) return { item, custom: section.source !== undefined };
    }
  }
  return null;
};

export { findSetting };
