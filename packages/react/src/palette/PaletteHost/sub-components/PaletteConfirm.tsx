/* @layer renderer-shell @kind component */
import { ConfirmIconButton } from '@drizztdourden08/tessera/composites';
import { Box, Icon, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import type { MouseEvent } from 'react';
import type { PaletteConfirmProps } from '../PaletteHost.type';

const PaletteConfirm = (props: PaletteConfirmProps) => {
  const { item, armed, onArm, onConfirm, onSettle } = props;
  const { common } = useTesseraStrings();
  const arm = (event: MouseEvent): void => {
    event.stopPropagation();
    onArm();
  };
  return (
    <Box onClickCapture={armed ? undefined : arm} onClick={armed ? onSettle : undefined}>
      <ConfirmIconButton
        key={armed ? 'asking' : 'idle'}
        size="xs"
        placement="end"
        icon={item.icon ?? <Icon name="check" />}
        label={item.label}
        confirmLabel={item.label}
        cancelLabel={common.cancel}
        defaultArmed={armed}
        disabled={item.disabled}
        onConfirm={onConfirm}
      />
    </Box>
  );
};

export { PaletteConfirm };
