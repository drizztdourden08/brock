/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { Button } from '@drizztdourden08/tessera/primitives';
import type { MenuBarItemProps } from './MenuBarItem.type';

const MenuBarItem = ({ label, nodes, open, peek, onOpen, onClose }: MenuBarItemProps) => {
  const anchor = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        ref={anchor}
        variant="ghost"
        size="xs"
        role="menuitem"
        aria-haspopup="menu"
        active={open}
        aria-expanded={open}
        data-menu-bar-button=""
        onClick={open ? onClose : onOpen}
        onPointerEnter={peek && !open ? onOpen : undefined}
      >
        {label}
      </Button>
      {open && <DropdownMenu groups={[{ id: 'menu-bar', items: nodes }]} anchorRef={anchor} side="below" align="start" label={label} onClose={onClose} />}
    </>
  );
};

export { MenuBarItem };
