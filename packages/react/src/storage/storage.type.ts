/* @layer renderer-shell @kind types */
import type { DomainEntry } from '@drizztdourden08/brock-core';

interface DataDomainClient {
  domain: string;
  readJson: <T>(path: string) => Promise<T | null>;
  writeJson: (path: string, value: unknown) => Promise<void>;
  readBytes: (path: string) => Promise<Uint8Array | null>;
  writeBytes: (path: string, data: Uint8Array) => Promise<void>;
  list: (dir?: string) => Promise<DomainEntry[]>;
  remove: (path: string) => Promise<void>;
  size: (path?: string) => Promise<number>;
}

export type { DataDomainClient };
