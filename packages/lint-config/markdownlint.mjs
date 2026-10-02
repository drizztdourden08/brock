/* @layer tooling-scripts @kind config */
import { standardsMarkdownlint, STYLE_OFF } from '@drizztdourden08/standards/markdownlint';

const RULES_MODULE = '@drizztdourden08/brock-lint-config/markdown-rules';

/**
 * @param {{ ignores?: string[], globs?: string[], allow?: string[], config?: Record<string, unknown>}} [opts]
 * @returns {Record<string, unknown>}
 */
const brockMarkdownlint = (opts = {}) => standardsMarkdownlint({ rulesModule: RULES_MODULE, ...opts });

export { brockMarkdownlint, STYLE_OFF };
