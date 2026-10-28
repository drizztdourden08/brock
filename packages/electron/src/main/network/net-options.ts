/* @layer electron-main @kind logic */
import type { ProductNet } from '@drizztdourden08/brock-core/product';
import { NET_TYPE } from '@drizztdourden08/brock-core/product';
import type { NetLimits } from './net-options.type';

const typesOf = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length === 0 || value.some((type) => typeof type !== 'string' || !NET_TYPE.test(type))) {
    throw new Error('net.read types must be media types like "application/json" or "text/*"');
  }
  return value as string[];
};

const netOptions = (config: ProductNet, options: unknown): NetLimits => {
  if (options === undefined || options === null) return { maxBytes: config.maxBytes, types: undefined };
  if (typeof options !== 'object') throw new Error('net.read options must be an object');
  const { maxBytes, types } = options as Record<string, unknown>;
  if (maxBytes !== undefined && (typeof maxBytes !== 'number' || !Number.isInteger(maxBytes) || maxBytes <= 0)) throw new Error('net.read maxBytes must be a whole number above 0');
  return { maxBytes: Math.min(maxBytes ?? config.maxBytes, config.maxBytes), types: typesOf(types) };
};

export { netOptions };
