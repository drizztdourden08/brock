/* @layer tooling-scripts @kind config */
import { standardsMarkdownlint, STYLE_OFF } from '@drizztdourden08/standards/markdownlint';
import { generatedFiles } from './generated-files.mjs';

const RULES_MODULE = '@drizztdourden08/brock-lint-config/markdown-rules';

/**
 * @param {{ ignores?: string[], globs?: string[], allow?: string[], config?: Record<string, unknown>, rootDir?: string }} [opts]
 * @returns {Record<string, unknown>}
 */
const brockMarkdownlint = (opts = {}) => {
  const { ignores = [] } = opts;
  return standardsMarkdownlint({ rulesModule: RULES_MODULE, ...opts, ignores: [...generatedFiles(opts.rootDir ?? process.cwd()), ...ignores] });
};

export { brockMarkdownlint, STYLE_OFF };
