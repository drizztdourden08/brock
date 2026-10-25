/* @layer renderer-shell @kind types */
interface AxisRecordButtonProps {
  getValues: () => number[];
  label: string;
}

interface AxisSample {
  t: number;
  v: number[];
}

export type { AxisRecordButtonProps, AxisSample };
