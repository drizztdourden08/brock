/* @layer renderer-shell @kind component */
import { Box, Icon, IconButton, Span } from '@drizztdourden08/tessera/primitives';
import { isIconName } from '../../../menu/is-icon-name';
import { KIT_ICON, KIT_WORDS } from '../../kits/widget-kit.constants';
import type { KitBarProps } from '../KitLayer.type';

const KitBar = (props: KitBarProps) => {
  const { kit, onClose } = props;
  const close = KIT_WORDS.closeNamed(kit.label);
  const icon = kit.icon !== undefined && isIconName(kit.icon) ? kit.icon : KIT_ICON;
  return (
    <Box className="widget-kit-bar" role="toolbar" aria-label={kit.label} data-kit-bar={kit.id}>
      <Icon name={icon} size={14} />
      <Span className="widget-kit-bar__label">{kit.label}</Span>
      <IconButton size="xs" label={close} title={close} onClick={onClose} data-kit-close={kit.id}>
        <Icon name="x" size={14} />
      </IconButton>
    </Box>
  );
};

export { KitBar };
