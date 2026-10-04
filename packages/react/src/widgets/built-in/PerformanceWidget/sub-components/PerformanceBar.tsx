/* @layer renderer-shell @kind component */
import { CopyButton, Flex, Status } from '@drizztdourden08/tessera/primitives';
import { MS_PER_SECOND } from '../PerformanceWidget.constants';
import type { PerformanceBarProps } from '../PerformanceWidget.type';

const PerformanceBar = (props: PerformanceBarProps) => {
  const { active, refreshMs, snapshot } = props;
  return (
    <Flex className="performance-widget__bar" justify="between" align="center" gap="sm">
      <Status tone={active ? 'success' : 'neutral'} dot pulse={active}>{active ? `Live, every ${refreshMs / MS_PER_SECOND} s` : 'Paused'}</Status>
      <CopyButton text={snapshot} label="Copy snapshot" showLabel variant="secondary" />
    </Flex>
  );
};

export { PerformanceBar };
