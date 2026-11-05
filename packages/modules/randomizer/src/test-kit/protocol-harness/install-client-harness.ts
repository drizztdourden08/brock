/* @layer core @kind logic */
import { afterEach, beforeEach, vi } from 'vitest';
import { stubLocalStorage } from './stub-local-storage';

const installClientHarness = (): void => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubLocalStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
};

export { installClientHarness };
