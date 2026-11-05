/* @layer renderer-shell @kind component */
import { useProfilesStore } from '@drizztdourden08/brock-react';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { ArchipelagoFiles } from '../../ArchipelagoFiles';
import { FILES_TITLE } from '../../ArchipelagoFiles.constants';
import type { ArchipelagoFilesSlotProps } from './ArchipelagoFilesSlot.type';

const ArchipelagoFilesSlot = ({ sourceOf, span = 1, title = FILES_TITLE }: ArchipelagoFilesSlotProps) => {
  const config = useProfilesStore((state) => state.active)?.randomizer;
  if (config?.mode !== 'online') return null;
  return (
    <DashboardCard span={span} title={title}>
      <ArchipelagoFiles {...sourceOf(config)} />
    </DashboardCard>
  );
};

export { ArchipelagoFilesSlot };
