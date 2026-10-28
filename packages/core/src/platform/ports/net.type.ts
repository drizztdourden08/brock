/* @layer core @kind types */
interface NetReadOptions {
  maxBytes?: number;
  types?: string[];
}

interface NetReadResult {
  bytes: Uint8Array;
  contentType: string;
  url: string;
}

interface NetReadWire {
  bytes: ArrayBuffer;
  contentType: string;
  url: string;
}

interface NetPort {
  read: (url: string, options?: NetReadOptions) => Promise<NetReadResult>;
}

export type { NetPort, NetReadOptions, NetReadResult, NetReadWire };
