/* @layer core @kind types */
type LoopStep = (buffer: AudioBuffer, at: number, isOpeningPass: boolean) => number;

export type { LoopStep };
