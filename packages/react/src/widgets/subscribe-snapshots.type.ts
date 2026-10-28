/* @layer renderer-shell @kind types */
type ChangeSource = (listener: () => void) => () => void;

export type { ChangeSource };
