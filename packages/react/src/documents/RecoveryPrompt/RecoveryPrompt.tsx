/* @layer renderer-shell @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Button, formatDate } from '@drizztdourden08/tessera/primitives';
import { RECOVERY_TEXT } from '../documents.constants';
import type { RecoveryPromptProps } from '../documents.type';
import { useRecoveryPrompt } from './behavior/useRecoveryPrompt';

const describe = (name: string | null, savedAt: number, waiting: number): string => {
  const base = `${name ?? RECOVERY_TEXT.unnamed} has changes that were not saved. They were kept ${formatDate(savedAt, 'datetime')}.`;
  return waiting > 0 ? `${base} ${waiting} more can be recovered after this one.` : base;
};

const RecoveryPrompt = (props: RecoveryPromptProps) => {
  const prompt = useRecoveryPrompt(props);
  if (prompt.current === null) return null;
  return (
    <Dialog
      open
      title={RECOVERY_TEXT.title}
      message={describe(prompt.current.name, prompt.current.savedAt, prompt.waiting)}
      confirmLabel={RECOVERY_TEXT.restore}
      cancelLabel={RECOVERY_TEXT.later}
      onConfirm={prompt.restore}
      onCancel={prompt.later}
    >
      <Button variant="danger" onClick={prompt.discard}>{RECOVERY_TEXT.discard}</Button>
    </Dialog>
  );
};

export { RecoveryPrompt };
