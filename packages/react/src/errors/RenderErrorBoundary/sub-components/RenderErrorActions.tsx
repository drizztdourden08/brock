/* @layer renderer-shell @kind component */
import { Button, ButtonRow, Icon } from '@drizztdourden08/tessera/primitives';
import { bugReport } from '../../../bug-report/bug-report';
import { useT } from '../../../i18n';
import type { RenderErrorActionsProps } from '../RenderErrorBoundary.type';

const reload = (): void => window.location.reload();

const RenderErrorActions = (props: RenderErrorActionsProps) => {
  const { onHome } = props;
  const t = useT();
  return (
    <ButtonRow align="start">
      <Button size="sm" variant="tertiary" icon={<Icon name="rotate-ccw" />} onClick={reload}>{t('brock-app:errors.reload')}</Button>
      {onHome && <Button size="sm" variant="tertiary" icon={<Icon name="house" />} onClick={onHome}>{t('brock-app:errors.home')}</Button>}
      <Button size="sm" variant="tertiary" icon={<Icon name="bug" />} onClick={() => bugReport.open()}>{t('brock-app:errors.report')}</Button>
    </ButtonRow>
  );
};

export { RenderErrorActions };
