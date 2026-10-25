/* @layer renderer-shell @kind logic */
import type { FocusRegionOptions, FocusRegionProps } from './regions.type';

const focusRegion = (id: string, label: string, options: FocusRegionOptions = {}): FocusRegionProps => (
  { 'data-focus-region': id, role: options.role ?? 'region', 'aria-label': label }
);

export { focusRegion };
