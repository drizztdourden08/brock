/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { ContextMenu } from '@drizztdourden08/tessera/composites';
import { Card, Flex, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { markMenu } from '../../behavior/mark-menu';
import { useStatusMap } from '../../behavior/useStatusMap';
import { EVENT_LABEL, UNKNOWN_ITEM_LABEL } from '../../ChecksView.constants';
import { CheckArt } from '../CheckArt';
import { CheckBadges } from '../CheckBadges';
import type { CheckCardProps } from './CheckCard.type';

const CheckCard = ({ row, onToggle }: CheckCardProps) => {
  const text = useText();
  const statusMap = useStatusMap();
  const isEvent = row.kind === 'event';
  const title = isEvent ? row.label : (row.itemLabel ?? text(UNKNOWN_ITEM_LABEL));
  return (
    <ContextMenu groups={markMenu(row, onToggle, text)}>
      <Card>
        <Flex gap="sm" align="center">
          <CheckArt src={row.art} alt={title} />
          <Stack gap="2xs">
            <Text>{title}</Text>
            <Text variant="caption">{isEvent ? text(EVENT_LABEL) : row.label}</Text>
          </Stack>
          <Status map={statusMap} value={row.status} variant="pill" />
          <CheckBadges badges={row.badges} />
        </Flex>
      </Card>
    </ContextMenu>
  );
};

export { CheckCard };
