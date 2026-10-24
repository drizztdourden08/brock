/* @layer renderer-shell @kind logic */
import type { Section } from './settings.type';

const sectionKeys = (section: Section): string[] =>
  [...(section.items ?? []), ...(section.subsections ?? []).flatMap((sub) => sub.items)].map((item) => item.key);

export { sectionKeys };
