/* @layer renderer-shell @kind component */
import { useProduct } from '@drizztdourden08/brock-react';
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { ChangeRateDialogProps } from '../DisplaySettingsTab.type';

const ChangeRateDialog = (props: ChangeRateDialogProps) => {
  const { open, targetHz, currentHz, onConfirm, onCancel } = props;
  const { name } = useProduct();
  const from = currentHz === null ? 'its current rate' : `${Math.round(currentHz)} Hz`;

  return (
    <Dialog
      open={open}
      title={`Change your display to ${targetHz} Hz?`}
      message={`This changes your display from ${from} to ${targetHz} Hz and leaves it there. The screen goes black for a second while it switches.`}
      confirmLabel={`Change to ${targetHz} Hz`}
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <Stack gap="sm">
        <Text variant="caption">
          The rate stays until something changes it back. Pick another rate here, or use the display settings of your operating system.
        </Text>
        <Text variant="caption">
          {`To leave your desktop alone, cancel and turn on the synced rate in fullscreen. ${name} then borrows the rate only while in fullscreen and hands it back when fullscreen ends.`}
        </Text>
        <Text variant="caption">Other windows can move or resize when the rate changes, and some displays take a moment to settle.</Text>
      </Stack>
    </Dialog>
  );
};

export { ChangeRateDialog };
