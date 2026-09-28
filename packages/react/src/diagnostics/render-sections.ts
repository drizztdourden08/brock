/* @layer renderer-shell @kind logic */
import type { DebugSection } from './diagnostics.type';

const renderSections = (sections: readonly DebugSection[]): string =>
  sections
    .filter((section) => section.lines.length > 0)
    .map((section) => [`[${section.title}]`, ...section.lines].join('\n'))
    .join('\n\n');

export { renderSections };
