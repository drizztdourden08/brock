/* @layer renderer-shell @kind types */
import type { PatternValue } from '@drizztdourden08/tessera/composites';

interface LobbyCodeFieldProps {
  value: PatternValue;
  onChange: (next: PatternValue) => void;
  error?: string;
  disabled: boolean;
}

export type { LobbyCodeFieldProps };
