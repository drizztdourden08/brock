/* @layer core @kind types */
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type AppErrorOptions = {
  readonly code: string;
  readonly data?: JsonValue;
  readonly dataDropped?: boolean;
  readonly cause?: unknown;
};

type AppErrorShape = Error & {
  readonly code: string;
  readonly data: JsonValue | undefined;
  readonly dataDropped: boolean;
};

type AppErrorWire = {
  readonly code: string;
  readonly data?: JsonValue;
  readonly dataDropped?: boolean;
};

export type { JsonValue, AppErrorOptions, AppErrorShape, AppErrorWire };
