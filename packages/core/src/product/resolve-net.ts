/* @layer core @kind logic */
import { NET_DEFAULT_BYTES, NET_DEFAULT_TYPES, NET_HOST, NET_MAX_BYTES, NET_TYPE } from './net.constants';
import type { ProductNet, ProductNetInput } from './product.type';

const hostsOf = (input: string[]): string[] => {
  const hosts = input.map((host) => host.trim().toLowerCase());
  if (hosts.length === 0) throw new Error('product.net.hosts needs at least one host, or leave product.net out');
  const bad = hosts.find((host) => !NET_HOST.test(host));
  if (bad !== undefined) throw new Error(`product.net.hosts "${bad}" must be a plain host name like "example.com", with no scheme, port, path or wildcard`);
  return [...new Set(hosts)];
};

const typesOf = (input: readonly string[]): string[] => {
  const types = input.map((type) => type.trim().toLowerCase());
  const bad = types.find((type) => !NET_TYPE.test(type));
  if (bad !== undefined || types.length === 0) throw new Error(`product.net.contentTypes "${bad ?? ''}" must be a media type like "application/json" or "text/*"`);
  return types;
};

const bytesOf = (maxBytes: number): number => {
  if (!Number.isInteger(maxBytes) || maxBytes <= 0 || maxBytes > NET_MAX_BYTES) throw new Error(`product.net.maxBytes ${maxBytes} must be a whole number from 1 to ${NET_MAX_BYTES}`);
  return maxBytes;
};

const resolveNet = (input: ProductNetInput | undefined): ProductNet | undefined => {
  if (input === undefined) return undefined;
  return { hosts: hostsOf(input.hosts), contentTypes: typesOf(input.contentTypes ?? NET_DEFAULT_TYPES), maxBytes: bytesOf(input.maxBytes ?? NET_DEFAULT_BYTES) };
};

export { resolveNet };
