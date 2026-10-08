/* @layer tooling-scripts @kind constants */
const COPY_STEP_ID = 'tessera-copy';
const COPY_CHECK_ID = 'tessera-copy-check';
const COPY_FIRST_RELEASE_AFTER = '0.3.0';

const COPY_ENTRIES = Object.freeze([
  { folder: 'composites/field-kits', entry: 'field-kits' },
  { folder: 'composites/ColorPickerPopover', entry: 'color-picker-popover' },
  { folder: 'composites/ColorPicker', entry: 'color-picker' },
  { folder: 'composites', entry: 'composites' },
  { folder: 'primitives', entry: 'primitives' },
  { folder: 'data', entry: 'data' },
]);

const COPY_STYLESHEETS = Object.freeze({ 'tokens/index.css': 'tokens.css' });

const COPY_ATTRIBUTES = Object.freeze({ Stepper: Object.freeze({ buttons: 'sides' }) });

const COPY_OVERLAY = Object.freeze({
  '0.20.0': Object.freeze({ components: Object.freeze({ NumberStepper: 'NumberInput', NumberStepperProps: 'NumberInputProps' }) }),
});

const TESSERA_ENTRIES = Object.freeze(['primitives', 'composites', 'data', 'brand', 'field-kits', 'color-picker', 'color-picker-popover']);

const COPY_SOURCE = /\.(?:tsx?|mts|mjs|css)$/;
const COPY_SCRIPT = /\.(?:tsx?|mts|mjs)$/;
const COPY_STYLE = /\.css$/;
const ALIAS_CONFIG = /(?:^|\/)(?:tsconfig[^/]*\.json|[^/]*\.config\.[cm]?[jt]s)$/;
const TESSERA_MENTION = /['"]@drizztdourden08\/tessera(?:[-/][\w./-]*)?['"]/;
const CSS_REFERENCE = /(?:@import\s+(?:url\(\s*)?|url\(\s*)(['"]?)([^'")\s]+)\1/g;

export {
  ALIAS_CONFIG, COPY_ATTRIBUTES, COPY_CHECK_ID, COPY_ENTRIES, COPY_FIRST_RELEASE_AFTER, COPY_OVERLAY, COPY_SCRIPT, COPY_SOURCE, COPY_STEP_ID, COPY_STYLE,
  COPY_STYLESHEETS, CSS_REFERENCE, TESSERA_ENTRIES, TESSERA_MENTION,
};
