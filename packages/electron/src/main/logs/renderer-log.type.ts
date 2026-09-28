/* @layer electron-main @kind types */
type RendererLogLevel = 'info' | 'warn' | 'error';

type RendererLogger = (channel: string, level: RendererLogLevel, message: string) => void;

export type { RendererLogger, RendererLogLevel };
