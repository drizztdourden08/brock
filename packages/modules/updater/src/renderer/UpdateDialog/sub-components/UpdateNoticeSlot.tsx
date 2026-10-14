/* @layer renderer-shell @kind component */
import { Box, Callout } from '@drizztdourden08/tessera/primitives';
import type { UpdateNoticeSlotProps } from '../UpdateDialog.type';

const UpdateNoticeSlot = (props: UpdateNoticeSlotProps) => {
  const { children } = props;
  if (typeof children === 'string') return <Callout tone="warning">{children}</Callout>;
  return <Box className="update-dialog__notice">{children}</Box>;
};

export { UpdateNoticeSlot };
