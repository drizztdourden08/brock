/* @layer renderer-shell @kind component */
import { Button, ButtonRow, Icon } from '@drizztdourden08/tessera/primitives';
import { bugReport } from '../../../bug-report/bug-report';
import { HOME_LABEL, RELOAD_LABEL, REPORT_LABEL } from '../../errors.constants';
import type { RenderErrorActionsProps } from '../RenderErrorBoundary.type';

const reload = (): void => window.location.reload();

const RenderErrorActions = (props: RenderErrorActionsProps) => {
  const { onHome } = props;
  return (
    <ButtonRow align="start">
      <Button size="sm" variant="tertiary" icon={<Icon name="rotate-ccw" />} onClick={reload}>{RELOAD_LABEL}</Button>
      {onHome && <Button size="sm" variant="tertiary" icon={<Icon name="house" />} onClick={onHome}>{HOME_LABEL}</Button>}
      <Button size="sm" variant="tertiary" icon={<Icon name="bug" />} onClick={bugReport.open}>{REPORT_LABEL}</Button>
    </ButtonRow>
  );
};

export { RenderErrorActions };
