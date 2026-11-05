/* @layer renderer-shell @kind types */
import type { RandomizerProfileConfig } from '../../../../../augment';
import type { DashboardSpan } from '../../../dashboard/DashboardCard';
import type { ArchipelagoFilesSource } from '../../ArchipelagoFiles.type';

interface ArchipelagoFilesSlotProps {
  sourceOf(config: RandomizerProfileConfig): ArchipelagoFilesSource;
  span?: DashboardSpan;
  title?: string;
}

export type { ArchipelagoFilesSlotProps };
