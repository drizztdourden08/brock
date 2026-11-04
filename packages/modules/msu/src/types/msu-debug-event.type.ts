/* @layer core @kind types */
type MsuDebugOwner = 'pack' | 'chip' | 'skipped';

interface MsuDebugEvent {
  id: number;
  at: number;
  channel: string;
  detail: string;
  owner: MsuDebugOwner;
}

export type { MsuDebugEvent, MsuDebugOwner };
