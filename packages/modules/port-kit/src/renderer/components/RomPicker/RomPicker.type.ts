/* @layer renderer-shell @kind types */
interface DroppedRom {
  name: string;
  bytes: Uint8Array;
}

interface RomPickerProps {
  extensions: string[];
  onRom: (rom: DroppedRom) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export type { DroppedRom, RomPickerProps };
