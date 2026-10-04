/* @layer renderer-shell @kind logic */
import type { BootFailure } from '@drizztdourden08/brock-core';

const failureTitle = (failure: BootFailure): string => (failure.timedOut ? `${failure.label} took too long` : `${failure.label} failed`);

export { failureTitle };
