/* @layer renderer-shell @kind types */
type NumberSetterProps = {
  title: string;
  value: number;
  min: number;
  max: number;
  steps?: readonly number[];
  ladder?: readonly number[];
  format?: (value: number) => string;
  anchor: HTMLElement | null;
  onCommit: (value: number) => void;
  onClose: () => void;
};

type NudgeParams = {
  ladder: readonly number[] | undefined;
  steps: readonly number[];
  value: number;
  dir: 1 | -1;
};

export type { NudgeParams, NumberSetterProps };
