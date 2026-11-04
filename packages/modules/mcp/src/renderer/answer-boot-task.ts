/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { RendererBootTask } from '@drizztdourden08/brock-react';
import { installAnswers } from './install-answers';

let stop: (() => void) | null = null;

const answerBootTask: RendererBootTask = {
  id: 'mcp-answers',
  label: 'Opening the agent tools',
  weight: 1,
  run: () => {
    stop?.();
    stop = hostApi() === null ? null : installAnswers();
  },
};

export { answerBootTask };
