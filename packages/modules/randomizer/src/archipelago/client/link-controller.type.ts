/* @layer core @kind types */
interface LinkController {
  begin(): void;
  markConnected(): void;
  fail(message: string, logLine?: string): void;
  close(): void;
}

export type { LinkController };
