/* @layer renderer-shell @kind types */
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';

type InputGlyphKind = 'stick' | 'trigger' | 'button';

interface InputGlyphProps {
  family: InputIconFamily;
  kind: InputGlyphKind;
  name: string;
  label: string;
}

export type { InputGlyphKind, InputGlyphProps };
