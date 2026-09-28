/* @layer renderer-shell @kind types */
interface MenuResolver {
  closeMenu: () => void;
  openScreen: (id: string) => void;
}

export type { MenuResolver };
