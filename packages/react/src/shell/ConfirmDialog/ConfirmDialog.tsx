/* @layer renderer-shell @kind component */
import { Dialog, FactsPanel } from '@drizztdourden08/tessera/composites';
import { Button } from '@drizztdourden08/tessera/primitives';
import { useDialogStore } from '../../stores/useDialogStore';
import { ConfirmChoices } from './sub-components/ConfirmChoices';

const noop = () => {};

const ConfirmDialog = () => {
  const dialog = useDialogStore((s) => s.dialog);
  const dismiss = useDialogStore((s) => s.dismiss);
  const choose = useDialogStore((s) => s.choose);

  if (!dialog) return <Dialog open={false} title="" message="" onConfirm={noop} onCancel={dismiss} />;
  const { choices, choice, alternate, facts } = dialog;
  return (
    <Dialog
      open
      title={dialog.title}
      message={dialog.message}
      confirmLabel={dialog.confirmLabel}
      cancelLabel={dialog.cancelLabel}
      variant={dialog.variant}
      onConfirm={dialog.onConfirm}
      onCancel={dismiss}
    >
      {facts && facts.length > 0 && <FactsPanel groups={[facts]} layout="rows" label={dialog.title} />}
      {alternate && <Button variant={alternate.tone === 'neutral' ? 'secondary' : 'danger'} onClick={alternate.onSelect}>{alternate.label}</Button>}
      {choices && choices.length > 0 && (
        <ConfirmChoices choices={choices} value={choice} label={dialog.title} look={dialog.look} searchable={dialog.searchable} onChange={choose} />
      )}
    </Dialog>
  );
};

export { ConfirmDialog };
