/* @layer renderer-shell @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Button, formatDate } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../i18n';
import { RECOVERY_TEXT } from '../documents.constants';
import type { RecoveryPromptProps } from '../documents.type';
import { useRecoveryPrompt } from './behavior/useRecoveryPrompt';

const RecoveryPrompt = (props: RecoveryPromptProps) => {
  const prompt = useRecoveryPrompt(props);
  const t = useT();
  const text = useText();
  if (prompt.current === null) return null;
  const { name, savedAt } = prompt.current;
  return (
    <Dialog
      open
      title={text(RECOVERY_TEXT.title)}
      message={t('brock-app:documents.recovery.message', { name: name ?? text(RECOVERY_TEXT.unnamed), date: formatDate(savedAt, 'datetime'), waiting: prompt.waiting })}
      confirmLabel={text(RECOVERY_TEXT.restore)}
      cancelLabel={text(RECOVERY_TEXT.later)}
      onConfirm={prompt.restore}
      onCancel={prompt.later}
    >
      <Button variant="danger" onClick={prompt.discard}>{text(RECOVERY_TEXT.discard)}</Button>
    </Dialog>
  );
};

export { RecoveryPrompt };
