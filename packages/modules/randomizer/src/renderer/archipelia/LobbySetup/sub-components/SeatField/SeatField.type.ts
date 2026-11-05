/* @layer renderer-shell @kind types */
interface SeatFieldProps {
  seats: readonly string[];
  picked: string | null;
  onPick: (seat: string | null) => void;
  disabled: boolean;
}

export type { SeatFieldProps };
