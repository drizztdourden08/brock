/* @layer tooling-scripts @kind logic */

const RESERVED = ['include', 'exclude'];
const SYSTEMS = [[/^windows|^win32$/, 'win32'], [/^ubuntu|^linux/, 'linux'], [/^macos|^darwin/, 'darwin']];

const matches = (entry, filter) => Object.entries(filter).every(([key, value]) => entry[key] === value);

const withIncludes = (combos, includes, axes) => {
  const result = combos.map((combo) => ({ ...combo }));
  for (const include of includes) {
    const shared = Object.fromEntries(Object.entries(include).filter(([key]) => axes.includes(key)));
    const hits = axes.length ? result.filter((combo) => matches(combo, shared)) : [];
    if (hits.length) for (const hit of hits) Object.assign(hit, include);
    else result.push({ ...include });
  }
  return result;
};

/**
 * @param {unknown} matrix the job's strategy.matrix
 * @returns {Record<string, unknown>[] | null} the entries, null for a matrix that is an expression
 */
const matrixEntries = (matrix) => {
  if (matrix === null || matrix === undefined) return [{}];
  if (typeof matrix !== 'object' || Array.isArray(matrix)) return null;
  const axes = Object.keys(matrix).filter((key) => !RESERVED.includes(key) && Array.isArray(matrix[key]));
  const product = axes.reduce((combos, key) => combos.flatMap((combo) => matrix[key].map((value) => ({ ...combo, [key]: value }))), axes.length ? [{}] : []);
  const excludes = Array.isArray(matrix.exclude) ? matrix.exclude : [];
  const kept = product.filter((combo) => !excludes.some((filter) => matches(combo, filter)));
  const all = withIncludes(kept, Array.isArray(matrix.include) ? matrix.include : [], axes);
  return all.length ? all : [{}];
};

/**
 * @param {unknown} label a runs-on or matrix os value such as windows-latest
 * @returns {string | null} the Node platform it names, null when it names none
 */
const platformOf = (label) => {
  const lower = String(label).toLowerCase();
  return SYSTEMS.find(([pattern]) => pattern.test(lower))?.[1] ?? null;
};

export { matrixEntries, platformOf };
