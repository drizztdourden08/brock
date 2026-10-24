/* @layer renderer-shell @kind logic */
import type { StartupPromptDef, StartupPromptEntry } from './startup.type';

const startupPromptsFromFiles = (entries: readonly StartupPromptEntry[]): readonly StartupPromptDef[] =>
  [...entries].sort((a, b) => a.id.localeCompare(b.id)).map(({ id, prompt }) => ({ ...prompt, id }));

export { startupPromptsFromFiles };
