/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { JobDialogActionsProps } from '../../JobDialog.type';

const JobDialogActions = (props: JobDialogActionsProps) => {
  const { job, onHide, onCancel, onClose } = props;
  if (job.state !== 'running') return <Button variant="primary" onClick={onClose}>Close</Button>;
  return (
    <>
      {job.cancellable && <Button variant="danger" onClick={onCancel}>Cancel</Button>}
      <Button variant="secondary" onClick={onHide}>Hide</Button>
    </>
  );
};

export { JobDialogActions };
