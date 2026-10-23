/* @layer renderer-shell @kind logic */
import type { QuitDecision } from '@drizztdourden08/brock-core';
import { confirmQuit } from './confirm-quit';

const answerQuit = async (): Promise<QuitDecision> => ((await confirmQuit()) ? 'quit' : 'stay');

export { answerQuit };
