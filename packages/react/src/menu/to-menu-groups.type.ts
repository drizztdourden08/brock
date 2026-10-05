/* @layer renderer-shell @kind types */
interface MenuResolver {
  openScreen: (id: string, fresh?: boolean) => void;
  armed?: string | null;
}

export type { MenuResolver };
