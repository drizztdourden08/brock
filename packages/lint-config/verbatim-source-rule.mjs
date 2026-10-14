/* @layer tooling-scripts @kind logic */
import { KIND_HEADER, VERBATIM_KIND, VERBATIM_SOURCE_MESSAGE } from './data-kind.constants.mjs';

const verbatimSource = {
  meta: {
    type: 'problem',
    docs: { description: 'A file whose header says @kind verbatim names the source of its text with @source, so a review sees where the exempt text comes from' },
    schema: [],
    messages: { missing: VERBATIM_SOURCE_MESSAGE },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      Program() {
        const header = sourceCode.getAllComments().find((comment) => comment.type !== 'Shebang');
        const verbatim = header && /@kind\s+verbatim\b/.test(header.value);
        if (!verbatim) return;
        const [, kind, source] = KIND_HEADER.exec(header.value) ?? [];
        if (kind !== VERBATIM_KIND || !source) context.report({ loc: header.loc, messageId: 'missing' });
      },
    };
  },
};

export { verbatimSource };
