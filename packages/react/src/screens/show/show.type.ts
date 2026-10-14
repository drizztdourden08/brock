/* @layer renderer-shell @kind types */
import type { FormFactor, HostShell, Profile } from '@drizztdourden08/brock-core';

interface ShowContext {
  profile: Profile | null;
  host: HostShell;
  formFactor: FormFactor;
}

interface ShowRule {
  hosts?: readonly HostShell[];
  when?: (ctx: ShowContext) => boolean;
}

export type { ShowContext, ShowRule };
