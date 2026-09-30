/* @layer root-config @kind config */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/tests/**/*.test.ts', 'packages/*/tests/**/*.test.mjs', 'packages/modules/*/tests/**/*.test.ts'],
    passWithNoTests: true,
  },
});
