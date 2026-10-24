/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { orderStartupPrompts } from './order-startup-prompts';
import { NO_STARTUP_PROMPTS } from './startup.constants';
import type { StartupPromptDef } from './startup.type';

const useAllStartupPrompts = (fromModules: readonly StartupPromptDef[], fromApp: readonly StartupPromptDef[] = NO_STARTUP_PROMPTS): readonly StartupPromptDef[] =>
  useMemo(() => orderStartupPrompts([...fromModules, ...fromApp]), [fromModules, fromApp]);

export { useAllStartupPrompts };
