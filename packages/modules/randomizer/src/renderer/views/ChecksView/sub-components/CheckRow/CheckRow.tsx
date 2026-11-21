/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { ContextMenu } from '@drizztdourden08/tessera/composites';
import { Flex, Status, Text } from '@drizztdourden08/tessera/primitives';
import { markMenu } from '../../behavior/mark-menu';
import { useStatusMap } from '../../behavior/useStatusMap';
import { CheckBadges } from '../CheckBadges';
import type { CheckRowProps } from './CheckRow.type';

const CheckRow = ({ row, detailed, onToggle }: CheckRowProps) => {
  const text = useText();
  const statusMap = useStatusMap();
  return (
    <ContextMenu groups={markMenu(row, onToggle, text)}>
      <Flex align="center" gap="sm">
        <Status map={statusMap} value={row.status} dot />
        <Text>{row.label}</Text>
        {detailed && row.itemLabel !== null && <Text variant="caption">{row.itemLabel}</Text>}
        <CheckBadges badges={row.badges} />
      </Flex>
    </ContextMenu>
  );
};

export { CheckRow };
