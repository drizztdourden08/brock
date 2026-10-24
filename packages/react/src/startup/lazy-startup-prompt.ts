/* @layer renderer-shell @kind logic */
import type { StartupPromptDef, StartupPromptLoader, StartupPromptShell } from './startup.type';

const lazyStartupPrompt = (shell: StartupPromptShell, load: StartupPromptLoader): StartupPromptDef => ({
  ...shell,
  run: async (ctx) => (await load()).default.run(ctx),
});

export { lazyStartupPrompt };
