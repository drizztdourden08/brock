/* @layer renderer-shell @kind component */
import { Box, Button, EmptyState, Icon } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../../i18n';
import { KIT_WORDS } from '../../kits/widget-kit.constants';
import type { KitWaitingProps } from '../KitLayer.type';

const KitWaiting = (props: KitWaitingProps) => {
  const { kit, reason, onClose } = props;
  const t = useT();
  const text = useText();
  return (
    <Box className="widget-kit-layer__waiting" role="status" data-kit-waiting={kit.id}>
      <EmptyState
        size="md"
        icon={<Icon name="lock" size={24} />}
        title={t('brock-app:kit.waiting', { label: kit.label })}
        message={reason}
        action={<Button size="sm" variant="secondary" onClick={onClose}>{text(KIT_WORDS.close)}</Button>}
      />
    </Box>
  );
};

export { KitWaiting };
