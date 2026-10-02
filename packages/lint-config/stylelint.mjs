/* @layer tooling-scripts @kind config */
import { standardsStylelint, TOKEN_ONLY_RULES, TOKEN_DERIVED_RULES, TOKEN_RULES_OFF, COMMENT_ALLOW, QUERY_LENGTHS } from '@drizztdourden08/standards/stylelint';
import brockLint from './standards.extension.mjs';

/**
 * @param {import('@drizztdourden08/standards').StylelintOptions} [opts]
 * @returns {Record<string, unknown>}
 */
const brockStylelint = (opts = {}) => standardsStylelint({ ...opts, extensions: [brockLint, ...(opts.extensions ?? [])] });

export { brockStylelint, TOKEN_ONLY_RULES, TOKEN_DERIVED_RULES, TOKEN_RULES_OFF, COMMENT_ALLOW, QUERY_LENGTHS };
