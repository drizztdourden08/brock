/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { COPY_LABELS, SAVE_LABELS } from '../diagnostics-wizard.constants';
import { FlashButton } from './FlashButton';
import type { SummaryActionsProps } from './diagnostics-steps.type';

const SummaryActions = (props: SummaryActionsProps) => {
  const { restartLabel, onRestart, saveStatus, onSave, copyStatus, onCopy } = props;

  return (
    <>
      <Button variant="secondary" onClick={onRestart}>{restartLabel}</Button>
      <FlashButton status={saveStatus} onClick={onSave} labels={SAVE_LABELS} />
      <FlashButton status={copyStatus} onClick={onCopy} labels={COPY_LABELS} />
    </>
  );
};

export { SummaryActions };
