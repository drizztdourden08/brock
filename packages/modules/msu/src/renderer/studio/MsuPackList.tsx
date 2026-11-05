/* @layer renderer-shell @kind component */
import { useCallback } from 'react';
import { Center, Icon, Status, IconButton, EmptyState, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { formatBytes } from '@drizztdourden08/brock-core';
import type { MsuPackListProps } from './MsuPackList.type';

const MsuPackList = (props: MsuPackListProps) => {
  const { loading, packs, selected, isInstalled, badge, onSelect, onDelete } = props;

  const handleDeleteClick = useCallback((e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    onDelete(name);
  }, [onDelete]);

  if (loading) return <Center><Spinner /></Center>;

  if (packs.length === 0) {
    return (
      <Stack gap="xs">
        <EmptyState message="No music packs yet. Create an empty one or import a pack" />
      </Stack>
    );
  }

  return (
    <Stack gap="xs">
      {packs.map((pack) => (
        <ListItemRow
          key={pack.name}
          icon={<Icon name="headphones" />}
          name={pack.name}
          meta={
            <>
              {`${pack.fileCount} file${pack.fileCount !== 1 ? 's' : ''} · ${formatBytes(pack.totalSize)} · `}
              <Status tone={pack.format === 'layered' ? 'success' : 'neutral'}>
                {pack.format === 'layered' ? 'Layered' : 'Classic'}
              </Status>
            </>
          }
          columns={isInstalled(pack.name) ? [{ primary: badge(pack.name), align: 'end' }] : undefined}
          selected={selected === pack.name}
          onClick={() => onSelect(pack.name)}
          action={
            <IconButton
              variant="ghost"
              size="sm"
              label={isInstalled(pack.name) ? 'Uninstall' : 'Delete'}
              onClick={(e) => handleDeleteClick(e, pack.name)}
            >
              <Icon name="x" />
            </IconButton>
          }
        />
      ))}
    </Stack>
  );
};

export { MsuPackList };
