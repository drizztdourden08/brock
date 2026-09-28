/* @layer renderer-shell @kind logic */
import type { ResolvedSection } from '../SettingsLayout.type';

const countRows = (sections: readonly ResolvedSection[]): number =>
  sections.reduce((sum, section) => sum + section.groups.reduce((n, group) => n + group.items.length, 0), 0);

export { countRows };
