/* @layer renderer-shell @kind logic */
import { DEFAULT_PROMPT_ORDER } from './startup.constants';
import type { StartupPromptDef } from './startup.type';

const orderOf = (prompt: StartupPromptDef): number => prompt.order ?? DEFAULT_PROMPT_ORDER;

const orderStartupPrompts = (prompts: readonly StartupPromptDef[]): readonly StartupPromptDef[] =>
  prompts.map((prompt, index) => ({ prompt, index })).sort((a, b) => orderOf(a.prompt) - orderOf(b.prompt) || a.index - b.index).map(({ prompt }) => prompt);

export { orderStartupPrompts };
