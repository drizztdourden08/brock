/* @layer renderer-shell @kind logic */
import { resolveItemText } from './resolve-item-text';
import type { TextOf } from './resolve-item-text.type';
import type { Section, SectionDef, SubSection, SubSectionDef } from './settings.type';

const subOf = (sub: SubSectionDef, text: TextOf): SubSection => ({
  id: sub.id,
  title: text(sub.title),
  items: sub.items.map((item) => resolveItemText(item, text)),
});

const resolveSectionText = (sections: readonly SectionDef[], text: TextOf): Section[] =>
  sections.map((section) => {
    const { title, items, subsections, ...rest } = section;
    return {
      ...rest,
      title: text(title),
      ...(items === undefined ? {} : { items: items.map((item) => resolveItemText(item, text)) }),
      ...(subsections === undefined ? {} : { subsections: subsections.map((sub) => subOf(sub, text)) }),
    };
  });

export { resolveSectionText };
