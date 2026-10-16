/* @layer renderer-shell @kind component */
import { Box, Button, EmptyState, Icon } from '@drizztdourden08/tessera/primitives';
import { KIT_WORDS } from '../../kits/widget-kit.constants';
import type { KitWaitingProps } from '../KitLayer.type';

const KitWaiting = (props: KitWaitingProps) => {
  const { kit, reason, onClose } = props;
  return (
    <Box className="widget-kit-layer__waiting" role="status" data-kit-waiting={kit.id}>
      <EmptyState
        size="md"
        icon={<Icon name="lock" size={24} />}
        title={KIT_WORDS.waiting(kit.label)}
        message={reason}
        action={<Button size="sm" variant="secondary" onClick={onClose}>{KIT_WORDS.close}</Button>}
      />
    </Box>
  );
};

export { KitWaiting };
