/* @layer renderer-shell @kind types */
import type { FormFactor, HostShell, Profile, ShowFlags } from '@drizztdourden08/brock-core';
import type { ScreenParams } from '../../navigation/navigation.type';

type ShowFlagValues = Readonly<Partial<ShowFlags> & Record<string, unknown>>;

interface ShowContext {
  profile: Profile | null;
  host: HostShell;
  formFactor: FormFactor;
  flags: ShowFlagValues;
  params: Readonly<ScreenParams>;
}

interface ShowRule {
  hosts?: readonly HostShell[];
  when?: (ctx: ShowContext) => boolean;
}

interface ShowFlagsState {
  sources: Readonly<Record<string, ShowFlagValues>>;
  flags: ShowFlagValues;
  put: (source: string, values: ShowFlagValues) => void;
  drop: (source: string) => void;
}

export type { ShowContext, ShowFlagsState, ShowFlagValues, ShowRule };
