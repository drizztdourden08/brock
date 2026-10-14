/* @layer renderer-shell @kind component */
import { Button, Callout } from '@drizztdourden08/tessera/primitives';
import type { SendErrorProps } from './SendError.type';
import { FALLBACK_LABEL } from '../BugReportDialog.constants';

const SendError = (props: SendErrorProps) => {
  const { error, fallback } = props;
  if (error === null) return null;
  const action = fallback ? <Button variant="secondary" size="sm" onClick={fallback}>{FALLBACK_LABEL}</Button> : undefined;
  return <Callout tone="danger" action={action}>The report was not sent: {error}</Callout>;
};

export { SendError };
