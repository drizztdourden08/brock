/* @layer renderer-shell @kind logic */
import type { StartupPromptDef } from './startup.type';

const defineStartupPrompt = <S extends object = object>(prompt: StartupPromptDef<S>): StartupPromptDef<S> => prompt;

export { defineStartupPrompt };
