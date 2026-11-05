/* @layer renderer-shell @kind types */
interface IntervalTimesProps {
  atSeconds: number[];
  disabled?: boolean;
  onChange: (atSeconds: number[]) => void;
}

export type { IntervalTimesProps };
