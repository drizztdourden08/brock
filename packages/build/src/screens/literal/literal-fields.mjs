/* @layer tooling-scripts @kind logic */
import { UNKNOWN } from './literal.constants.mjs';

/** @param {unknown} value @returns {boolean} true when the value holds no part the reader could not read */
const isLiteral = (value) => {
  if (value === UNKNOWN) return false;
  if (Array.isArray(value)) return value.every(isLiteral);
  if (value && typeof value === 'object') return Object.values(value).every(isLiteral);
  return true;
};

/** @param {unknown} value @returns {boolean} true for a string or a msg('ns:key') call read as { key } */
const isText = (value) => typeof value === 'string' || (typeof value === 'object' && value !== null && Object.keys(value).join() === 'key' && typeof value.key === 'string');

const FITS = { string: (value) => typeof value === 'string', text: isText, literal: isLiteral };

/**
 * @param {unknown} value what the literal reader returned
 * @param {Record<string, 'string' | 'text' | 'literal'>} fields the keys to keep, by the kind each takes
 * @param {readonly string[]} required the keys that must be set
 * @returns {Record<string, unknown> | null} those keys, or null when one does not fit
 */
const literalFields = (value, fields, required) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  if (required.some((key) => record[key] === undefined)) return null;
  const entries = Object.entries(fields).filter(([key]) => record[key] !== undefined);
  const fits = entries.every(([key, kind]) => FITS[kind](record[key]));
  return fits ? Object.fromEntries(entries.map(([key]) => [key, record[key]])) : null;
};

export { literalFields };
