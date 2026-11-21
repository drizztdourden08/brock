/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Flex, ProgressBar, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useStatusMap } from '../../behavior/useStatusMap';
import { BAR_LABEL, STATUS_ORDER, TOTAL_LABEL } from '../../ChecksView.constants';
import type { ChecksSummaryProps } from './ChecksSummary.type';

const percentOf = (done: number, total: number): number => (total > 0 ? Math.round((done / total) * 100) : 0);

const ChecksSummary = ({ counts }: ChecksSummaryProps) => {
  const text = useText();
  const statusMap = useStatusMap();
  return (
    <Stack gap="xs">
      <ProgressBar
        value={counts.checked}
        secondaryValue={counts.checked + counts.available}
        secondaryTone="primary"
        tone="secondary"
        max={Math.max(counts.total, 1)}
        label={text(BAR_LABEL)}
        showValue
        formatValue={() => `${percentOf(counts.checked, counts.total)}%`}
      />
      <Flex gap="md" wrap>
        {STATUS_ORDER.map((status) => (
          <Flex key={status} gap="xs" align="center" title={statusMap[status].label}>
            <Status map={statusMap} value={status} dot />
            <Text>{counts[status]}</Text>
            <Text tone="faint">{statusMap[status].label.toLowerCase()}</Text>
          </Flex>
        ))}
        <Flex gap="xs" align="center">
          <Text>{counts.total}</Text>
          <Text tone="faint">{text(TOTAL_LABEL)}</Text>
        </Flex>
      </Flex>
    </Stack>
  );
};

export { ChecksSummary };
