/* @layer renderer-shell @kind component */
import { CopyButton } from '@drizztdourden08/tessera/composites';
import { Flex, Status } from '@drizztdourden08/tessera/primitives';
import { useT } from '../../../../i18n';
import { MS_PER_SECOND } from '../PerformanceWidget.constants';
import type { PerformanceBarProps } from '../PerformanceWidget.type';

const PerformanceBar = (props: PerformanceBarProps) => {
  const { active, refreshMs, snapshot } = props;
  const t = useT();
  return (
    <Flex className="performance-widget__bar" justify="between" align="center" gap="sm">
      <Status tone={active ? 'success' : 'neutral'} dot pulse={active}>{active ? t('brock-app:perf.bar.live', { seconds: refreshMs / MS_PER_SECOND }) : t('brock-app:perf.bar.paused')}</Status>
      <CopyButton text={snapshot} label={t('brock-app:perf.bar.copy')} showLabel variant="secondary" />
    </Flex>
  );
};

export { PerformanceBar };
