/* @layer renderer-shell @kind types */
interface MenuResolver {
  openScreen: (id: string, fresh?: boolean) => void;
}

export type { MenuResolver };
