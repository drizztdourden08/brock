/* @layer tooling-scripts @kind constants */
const TARGETS_ARRAY = /(targets:\s*\[)([^\]]*)(\])/;
const MODULES_LINE = /^([ \t]*)modules:/m;
const QUOTED = /['"]([^'"]+)['"]/g;

export { TARGETS_ARRAY, MODULES_LINE, QUOTED };
