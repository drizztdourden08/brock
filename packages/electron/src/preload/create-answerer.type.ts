/* @layer electron-main @kind types */
type Answerer = (channel: string, handler: (...args: never[]) => unknown) => () => void;

export type { Answerer };
