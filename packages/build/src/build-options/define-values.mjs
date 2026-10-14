/* @layer tooling-scripts @kind logic */
import { DEFINE_NAME } from './build-options.constants.mjs';

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const isJsonValue = (value) => {
  if (value === null || ['string', 'boolean'].includes(typeof value)) return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isObject(value) && Object.values(value).every(isJsonValue);
};

/**
 * @param {unknown} define build.define of brock.config.ts or brock.site.ts
 * @param {string} file the config file, for the message
 * @returns {Record<string, string>} each name and its JSON expression, for Vite
 */
const defineValues = (define, file) => {
  if (define === undefined || define === null) return {};
  if (!isObject(define)) throw new Error(`${file} build.define maps a global name to its value.`);
  return Object.fromEntries(Object.entries(define).map(([name, value]) => {
    if (!DEFINE_NAME.test(name)) throw new Error(`${file} build.define: "${name}" is not a global name such as __APP_BUILD__.`);
    if (!isJsonValue(value)) throw new Error(`${file} build.define: ${name} must be a JSON value (a string, a number, a boolean, null, a list or an object of those).`);
    return [name, JSON.stringify(value)];
  }));
};

export { defineValues };
