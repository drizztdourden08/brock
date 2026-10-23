/* @layer renderer-shell @kind component */
import { useRef, useState } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { buildMenuBar } from '../build-menu-bar';
import { MENU_BAR_LABEL } from '../menu-bar.constants';
import { menuBarKeys } from '../menu-bar-keys';
import { useAltKey } from '../useAltKey';
import { useMenuBarView } from '../useMenuBarView';
import { MenuBarItem } from './sub-components/MenuBarItem';
import type { MenuBarProps } from './MenuBar.type';
import './MenuBar.css';

const MenuBar = ({ menus }: MenuBarProps) => {
  const [open, setOpen] = useState<number | null>(null);
  const row = useRef<HTMLElement>(null);
  const built = buildMenuBar(menus, useMenuBarView());
  useAltKey(() => setOpen((current) => (current === null ? 0 : null)));
  if (built.length === 0) return null;

  return (
    <Box ref={row} role="menubar" aria-label={MENU_BAR_LABEL} className="menu-bar" onKeyDown={menuBarKeys({ row, open, setOpen })}>
      {built.map(({ id, label, nodes }, index) => (
        <MenuBarItem
          key={id}
          label={label}
          nodes={nodes}
          open={open === index}
          peek={open !== null}
          onOpen={() => setOpen(index)}
          onClose={() => setOpen(null)}
        />
      ))}
    </Box>
  );
};

export { MenuBar };
