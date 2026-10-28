/* @layer core @kind logic */
import { NET_DEFAULT_BYTES, NET_DEFAULT_TYPES, NET_HOST, NET_MAX_BYTES, NET_TYPE } from './net.constants';
import type { ProductNet, ProductNetInput } from './product.type';

const resolveNet = (input: ProductNetInput | undefined): ProductNet | undefined => {
  if (input === undefined) return undefined;
  const hosts = input.hosts.map((host) => host.trim().toLowerCase());
  if (hosts.length === 0) throw new Error('product.net.hosts needs at least one host, or leave product.net out');
  const bad = hosts.find((host) => !NET_HOST.test(host));
  if (bad !== undefined) throw new Error(`product.net.hosts "${bad}" must be a plain host name like "example.com", with no scheme, port, path or wildcard`);
  const contentTypes = (input.contentTypes ?? NET_DEFAULT_TYPES).map((type) => type.trim().toLowerCase());
  const badType = contentTypes.find((type) => !NET_TYPE.test(type));
  if (badType !== undefined || contentTypes.length === 0) throw new Error(`product.net.contentTypes "${badType ?? ''}" must be a media type like "application/json" or "text/*"`);
  const maxBytes = input.maxBytes ?? NET_DEFAULT_BYTES;
  if (!Number.isInteger(maxBytes) || maxBytes <= 0 || maxBytes > NET_MAX_BYTES) throw new Error(`product.net.maxBytes ${maxBytes} must be a whole number from 1 to ${NET_MAX_BYTES}`);
  return { hosts: [...new Set(hosts)], contentTypes, maxBytes };
};

export { resolveNet };
