/* @layer renderer-shell @kind types */
interface WalkerBox {
  left: number;
  right: number;
  bottom: number;
}

interface WalkerReading {
  app: WalkerBox | null;
  walker: WalkerBox | null;
  actor: WalkerBox | null;
  palette: WalkerBox | null;
  hint: string | null;
}

export type { WalkerBox, WalkerReading };
