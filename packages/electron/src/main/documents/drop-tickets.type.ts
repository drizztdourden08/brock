/* @layer electron-main @kind types */
interface DropTickets {
  issue: (sender: number, paths: readonly string[]) => void;
  take: (sender: number, path: string) => boolean;
  has: (sender: number) => boolean;
  forget: (sender: number) => void;
}

export type { DropTickets };
