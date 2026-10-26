/* @layer tooling-scripts @kind config */
import {
  standardsEslint,
  LOCAL_RULES,
  NO_INLINE_EXPORT,
  BOUNDARY_RULES,
  PRIMITIVE_RULES,
  DEFAULT_COMMENT_ALLOW,
  DEFAULT_CONSOLE_GLOBS,
  slopRules,
} from '@drizztdourden08/standards/eslint';
import { allowWords } from './allow-words.mjs';
import { dataBlocks } from './data-blocks.mjs';
import { dataFiles } from './data-files.mjs';
import { verbatimText } from './verbatim-text.mjs';
import brockLint from './standards.extension.mjs';

const { rawControls: RAW_CONTROLS } = brockLint.eslint.options;

/**
 * @param {import('@drizztdourden08/standards').EslintOptions} [opts]
 * @returns {import('eslint').Linter.Config[]}
 */
const brockEslint = (opts = {}) => {
  const rootDir = opts.rootDir ?? process.cwd();
  const entries = dataFiles(rootDir);
  return standardsEslint({
    ...opts,
    allow: allowWords(opts),
    ignores: ['**/.brock/**', ...(opts.ignores ?? [])],
    presets: ['react-app', ...(opts.presets ?? [])],
    extensions: [brockLint, ...(opts.extensions ?? [])],
    verbatimText: [...verbatimText(entries), ...(opts.verbatimText ?? [])],
    extra: [...dataBlocks(rootDir, entries), ...(opts.extra ?? [])],
  });
};

export { brockEslint, LOCAL_RULES, NO_INLINE_EXPORT, RAW_CONTROLS, BOUNDARY_RULES, PRIMITIVE_RULES, DEFAULT_COMMENT_ALLOW, DEFAULT_CONSOLE_GLOBS, slopRules };
