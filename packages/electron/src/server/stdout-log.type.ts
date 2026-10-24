/* @layer electron-main @kind types */
interface LogSink {
  write: (text: string) => unknown;
}

export type { LogSink };
