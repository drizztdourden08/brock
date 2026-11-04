/* @layer core @kind types */
type ArchipelagoSocket = {
  send(text: string): void;
  close(): void;
  onOpen(f: () => void): void;
  onMessage(f: (text: string) => void): void;
  onClose(f: (code: number) => void): void;
};

export type { ArchipelagoSocket };
