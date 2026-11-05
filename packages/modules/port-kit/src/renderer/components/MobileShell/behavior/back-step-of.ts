/* @layer renderer-shell @kind logic */
import type { BackEdge } from '@drizztdourden08/brock-core';
import type { BackStep } from '../MobileShell.type';

const backStepOf = (isOpen: boolean, edge: BackEdge, hasScreen: boolean): BackStep => {
  if (isOpen) return 'close';
  if (edge !== 'left') return 'open';
  return hasScreen ? 'escape' : 'home';
};

export { backStepOf };
