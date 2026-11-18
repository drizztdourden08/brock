/* @layer renderer-shell @kind component */
import { Button, Callout } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../../i18n';
import type { SendErrorProps } from './SendError.type';
import { FALLBACK_LABEL } from '../BugReportDialog.constants';

const SendError = (props: SendErrorProps) => {
  const { error, fallback } = props;
  const t = useT();
  const text = useText();
  if (error === null) return null;
  const action = fallback ? <Button variant="secondary" size="sm" onClick={fallback}>{text(FALLBACK_LABEL)}</Button> : undefined;
  return <Callout tone="danger" action={action}>{t('brock-app:bugReport.notSent', { error })}</Callout>;
};

export { SendError };
