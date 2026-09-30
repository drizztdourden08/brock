/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { toDropdownItems } from '../../../../menu/to-dropdown-items';
import { useNavigation } from '../../../../navigation/useNavigation';
import type { TitleBarMenuProps } from './TitleBarMenu.type';

const TitleBarMenu = (props: TitleBarMenuProps) => {
  const { menu, open, onToggle, onClose, anchorRef } = props;
  const { open: openScreen } = useNavigation();
  const items = useMemo(() => toDropdownItems(menu, { closeMenu: onClose, openScreen }), [menu, onClose, openScreen]);

  return (
    <>
      <IconButton variant="ghost" size="sm" label="Menu" onClick={onToggle} active={open}>
        <Icon name="ellipsis-vertical" />
      </IconButton>
      {open && <DropdownMenu items={items} anchorRef={anchorRef} />}
    </>
  );
};

export { TitleBarMenu };
