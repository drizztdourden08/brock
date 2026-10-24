/* @layer renderer-shell @kind logic */
import { getAppLog } from '../log/get-app-log';
import type { StartupPromptContext, StartupPromptDef } from './startup.type';

const runOne = async (prompt: StartupPromptDef, index: number, ctx: StartupPromptContext): Promise<void> => {
  try {
    await prompt.run(ctx);
  } catch (error) {
    getAppLog().log('app', `Start-up prompt "${prompt.id ?? `#${index + 1}`}" failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
};

const runStartupPrompts = (prompts: readonly StartupPromptDef[], ctx: StartupPromptContext): Promise<void> =>
  prompts.reduce<Promise<void>>((chain, prompt, index) => chain.then(() => runOne(prompt, index, ctx)), Promise.resolve());

export { runStartupPrompts };
