/* @layer renderer-shell @kind component */
import { ConfirmIconButton } from '@drizztdourden08/tessera/composites';
import { Icon, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import type { PaletteConfirmProps } from '../PaletteHost.type';

const PaletteConfirm = (props: PaletteConfirmProps) => {
  const { item, armed, onArm, onConfirm, onSettle } = props;
  const { common } = useTesseraStrings();
  return (
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
      onAsk={onArm}
      onCancel={onSettle}
      onConfirm={onConfirm}
    />
  );
};

export { PaletteConfirm };
