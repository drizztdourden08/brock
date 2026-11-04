/* @layer renderer-shell @kind types */
import type { TrackerAssumption } from '../../../../../tracker';

interface AssumptionTogglesProps {
  assumptions: readonly TrackerAssumption[];
  active: readonly string[];
  onChange(ids: readonly string[]): void;
}

export type { AssumptionTogglesProps };
