/* @layer tooling-scripts @kind constants */
const COPY_STEP_ID = 'tessera-copy';
const COPY_CHECK_ID = 'tessera-copy-check';

const TESSERA_ENTRIES = Object.freeze(['primitives', 'composites', 'data', 'brand', 'field-kits', 'color-picker', 'color-picker-popover']);

const COPY_SOURCE = /\.(?:tsx?|mts|mjs|css)$/;
const COPY_SCRIPT = /\.(?:tsx?|mts|mjs)$/;
const COPY_STYLE = /\.css$/;
const ALIAS_CONFIG = /(?:^|\/)(?:tsconfig[^/]*\.json|[^/]*\.config\.[cm]?[jt]s)$/;
const TESSERA_MENTION = /['"]@drizztdourden08\/tessera(?:[-/][\w./-]*)?['"]/;
const CSS_REFERENCE = /(?:@import\s+(?:url\(\s*)?|url\(\s*)(['"]?)([^'")\s]+)\1/g;

export { ALIAS_CONFIG, COPY_CHECK_ID, COPY_SCRIPT, COPY_SOURCE, COPY_STEP_ID, COPY_STYLE, CSS_REFERENCE, TESSERA_ENTRIES, TESSERA_MENTION };
