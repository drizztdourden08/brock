/* @layer renderer-shell @kind logic */
import { formatUnits } from '../../../../diagnostics/format-units';
import type { AppFacts, PerformanceRow } from '../PerformanceWidget.type';

const listText = (items: readonly string[]): string => (items.length > 0 ? items.join(', ') : 'none');

const appRows = (facts: AppFacts): PerformanceRow[] => [
  { label: 'Version', value: facts.version },
  { label: 'Screen', value: facts.screen ?? 'home' },
  { label: 'Route', value: formatUnits.orDash(facts.route) },
  { label: 'Profile', value: facts.profile ?? 'none' },
  { label: 'Open widgets', value: listText(facts.openWidgets) },
  { label: 'Modules', value: listText(facts.modules) },
  { label: 'Log since start', value: `${facts.errors} errors, ${facts.warnings} warnings` },
];

export { appRows };
