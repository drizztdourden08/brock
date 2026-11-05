/* @layer renderer-shell @kind types */
import type { OptionTab, OptionTabProps } from '../../../contract/randomizer-views.type';
import type { ImpactCell } from '../PoolImpactCell';

interface OptionTabBodyProps extends OptionTabProps {
  tab: OptionTab;
  cellOf?: (key: string) => ImpactCell | undefined;
}

export type { OptionTabBodyProps };
