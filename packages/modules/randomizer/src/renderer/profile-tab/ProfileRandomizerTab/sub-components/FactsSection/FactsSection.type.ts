/* @layer renderer-shell @kind types */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';

interface FactsSectionProps {
  title: string;
  facts: readonly FactsPanelFact[];
}

export type { FactsSectionProps };
