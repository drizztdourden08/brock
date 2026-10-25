/* @layer renderer-shell @kind logic */
import type { FocusRegionProps } from './regions.type';

const focusRegion = (id: string, label: string): FocusRegionProps => ({ 'data-focus-region': id, role: 'region', 'aria-label': label });

export { focusRegion };
