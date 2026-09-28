/* @layer renderer-shell @kind constants */
import type { StorageSummary } from '@drizztdourden08/brock-core';

const EMPTY_SUMMARY: StorageSummary = {
  location: { path: '(browser)', osLabel: 'Browser', canReveal: false },
  domains: [],
  totalBytes: 0,
};

export { EMPTY_SUMMARY };
