/* @layer tooling-scripts @kind logic */

const INDICATOR_START = /^[>|!&*?\-:,[\]{}#%@`'"]/;

const AMBIGUOUS = /^(?:true|false|null|yes|no|on|off|~)$|^[-+]?(?:\d[\d_]*\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i;

/**
 * @param {string} value
 * @returns {boolean} whether a YAML parser reads `value` back as the same string when it is written plain
 */
const isPlainSafe = (value) =>
  value !== ''
  && value === value.trim()
  && !INDICATOR_START.test(value)
  && !value.includes(': ')
  && !value.includes(' #')
  && !value.endsWith(':')
  && !AMBIGUOUS.test(value);

/**
 * @param {string} value a catalog range or any one-line scalar
 * @returns {string} `value` as YAML, in single quotes only when a plain scalar would break
 */
const yamlScalar = (value) => (isPlainSafe(value) ? value : `'${value.replace(/'/g, "''")}'`);

/**
 * @param {string} text a YAML scalar as it sits after `key:`
 * @returns {string} the string it holds, without the surrounding quotes
 */
const readYamlScalar = (text) => {
  const value = text.trim();
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1).replace(/\\(["\\])/g, '$1');
  return value;
};

export { readYamlScalar, yamlScalar };
