/* @layer renderer-shell @kind types */
import type { Profile } from '@drizztdourden08/brock-core';
import type { nav } from '../navigation/nav';
import type { confirmAction } from '../stores/confirm-action';
import type { confirmChoice } from '../stores/confirm-choice';
import type { confirmSave } from '../stores/confirm-save';

interface StartupPromptSettings<S extends object = object> {
  get(): S;
  patch(patch: Partial<S>): void;
  flush(): Promise<void>;
}

interface StartupPromptContext<S extends object = object> {
  readonly confirmAction: typeof confirmAction;
  readonly confirmChoice: typeof confirmChoice;
  readonly confirmSave: typeof confirmSave;
  readonly profile: Profile;
  readonly settings: StartupPromptSettings<S>;
  readonly nav: typeof nav;
}

interface StartupPromptDef<S extends object = object> {
  readonly id?: string;
  readonly order?: number;
  run(ctx: StartupPromptContext<S>): Promise<void>;
}

type StartupPromptLoader = () => Promise<{ default: StartupPromptDef }>;

type StartupPromptShell = Pick<StartupPromptDef, 'order'>;

interface StartupPromptEntry {
  id: string;
  prompt: StartupPromptDef;
}

export type { StartupPromptContext, StartupPromptDef, StartupPromptEntry, StartupPromptLoader, StartupPromptSettings, StartupPromptShell };
