/* @layer renderer-shell @kind component */
import { Button, Flex, Status } from '@drizztdourden08/tessera/primitives';
import { MS_PER_SECOND } from '../PerformanceWidget.constants';
import type { PerformanceBarProps } from '../PerformanceWidget.type';

const PerformanceBar = (props: PerformanceBarProps) => {
  const { active, refreshMs, copied, onCopy } = props;
  return (
    <Flex className="performance-widget__bar" justify="between" align="center" gap="sm">
      <Status tone={active ? 'success' : 'neutral'} dot pulse={active}>{active ? `Live, every ${refreshMs / MS_PER_SECOND} s` : 'Paused'}</Status>
      <Button size="sm" variant="secondary" onClick={onCopy}>{copied ? 'Copied' : 'Copy snapshot'}</Button>
    </Flex>
  );
};

export { PerformanceBar };
