/* @layer root-config @kind config */
import { defineStandardsVitest } from '@drizztdourden08/standards/vitest';

export default defineStandardsVitest({
  esbuild: { jsx: 'automatic' },
  test: {
    include: [
      'packages/*/tests/**/*.test.ts', 'packages/*/tests/**/*.test.mjs', 'packages/modules/*/tests/**/*.test.ts',
      'packages/plugins/*/tests/**/*.test.mjs',
    ],
    passWithNoTests: true,
  },
});
