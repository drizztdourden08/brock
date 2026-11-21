/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useProduct, useText } from '@drizztdourden08/brock-react';
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { ChangeRateDialogProps } from '../DisplaySettingsTab.type';

const ChangeRateDialog = (props: ChangeRateDialogProps) => {
  const { open, targetHz, currentHz, onConfirm, onCancel } = props;
  const { name } = useProduct();
  const text = useText();
  const from = currentHz === null ? text(msg('display:dialog.currentRate')) : text(msg('display:rate.hz', { hz: Math.round(currentHz) }));

  return (
    <Dialog
      open={open}
      title={text(msg('display:dialog.title', { hz: targetHz }))}
      message={text(msg('display:dialog.message', { from, hz: targetHz }))}
      confirmLabel={text(msg('display:dialog.confirm', { hz: targetHz }))}
      cancelLabel={text(msg('display:dialog.cancel'))}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <Stack gap="sm">
        <Text variant="caption">{text(msg('display:dialog.note.stays'))}</Text>
        <Text variant="caption">{text(msg('display:dialog.note.synced', { name }))}</Text>
        <Text variant="caption">{text(msg('display:dialog.note.others'))}</Text>
      </Stack>
    </Dialog>
  );
};

export { ChangeRateDialog };
