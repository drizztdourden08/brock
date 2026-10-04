/* @layer renderer-shell @kind logic */
import type { MenuExpectation, MenuSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const missingFrom = (labels: readonly string[], wanted: readonly string[]): string[] =>
  wanted.filter((label) => !labels.includes(label));

const viewOutcomes = (sections: readonly string[], view: string | null): ReviewOutcome[] =>
  (view === null ? [] : [outcome('menu-view', sections.includes(view), `the menu has the ${view} sub-menu`, `the menu lacks the ${view} sub-menu`)]);

const menuChecks = (snapshot: MenuSnapshot, expected: MenuExpectation): ReviewOutcome[] => {
  const { open, items } = snapshot;
  if (!open) return [{ id: 'menu-opens', pass: false, reason: 'the menu did not open' }];
  const entries = items.filter((item) => !item.isSection).map((item) => item.label);
  const sections = items.filter((item) => item.isSection).map((item) => item.label);
  const missing = missingFrom(entries, expected.required);
  const missingSections = missingFrom(sections, expected.sections);
  const missingActions = missingFrom([...entries, ...sections], expected.actions);
  const builtIn = [...expected.required, ...expected.sections, ...expected.actions];
  const bare = items.filter((item) => builtIn.includes(item.label) && !item.hasIcon).map((item) => item.label);
  const sectionText = expected.sections.length > 0 ? `the ${expected.sections.join(', ')} section` : 'no section';
  return [
    outcome('menu-opens', true, `the menu opened with ${items.length} entries`, ''),
    outcome('menu-entries', missing.length === 0, `the menu has ${expected.required.join(', ')}`, `the menu lacks ${missing.join(', ')}`),
    outcome('menu-sections', missingSections.length === 0, `the menu has ${sectionText}`, `the menu lacks the ${missingSections.join(', ')} section`),
    outcome('menu-actions', missingActions.length === 0, `the menu has every title bar action: ${expected.actions.join(', ')}`, `the menu lacks the title bar action ${missingActions.join(', ')}`),
    ...viewOutcomes(sections, expected.view),
    outcome('menu-icons', bare.length === 0, 'every built-in entry has an icon', `no icon on ${bare.join(', ')}`),
  ];
};

export { menuChecks };
