/* @layer electron-main @kind types */
import type { DataDomainDef, DomainEntry, DomainUsage } from '@drizztdourden08/brock-core/platform';

interface DomainFiles {
  domain: string;
  dir: () => string;
  path: (rel?: string) => string;
  exists: (rel: string) => Promise<boolean>;
  readJson: <T>(rel: string, fallback: T) => Promise<T>;
  writeJson: (rel: string, value: unknown) => Promise<void>;
  readText: (rel: string) => Promise<string | null>;
  writeText: (rel: string, text: string) => Promise<void>;
  readBytes: (rel: string) => Promise<Uint8Array | null>;
  writeBytes: (rel: string, data: Uint8Array) => Promise<void>;
  list: (dir?: string) => Promise<DomainEntry[]>;
  remove: (rel: string) => Promise<void>;
  size: (rel?: string) => Promise<number>;
}

interface DataDomains {
  list: () => DataDomainDef[];
  def: (domain: string) => DataDomainDef;
  domain: (domain: string) => DomainFiles;
  usage: (domain: string) => Promise<DomainUsage>;
}

export type { DataDomains, DomainFiles };
