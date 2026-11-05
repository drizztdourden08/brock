/* @layer core @kind types */
interface ServerDeliveryEntry<L> {
  local: L;
  message: string;
  messageOf(): number;
  onComplete(): void;
  onGranted(): void;
}

interface ServerDeliveryDeps<L> {
  resolve(itemName: string): L | undefined;
  arrivalLine(itemName: string, senderName: string | null): string;
  openLine(line: string): number;
  closeLine(id: number): void;
  enqueue(entry: ServerDeliveryEntry<L>): string | null;
  waiting: Map<string, () => void>;
}

export type { ServerDeliveryDeps, ServerDeliveryEntry };
