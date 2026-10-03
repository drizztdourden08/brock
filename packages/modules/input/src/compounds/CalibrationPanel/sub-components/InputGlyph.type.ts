/* @layer renderer-shell @kind types */
interface InputGlyphProps {
  kind: 'stick' | 'trigger' | 'button';
  name: string;
  label: string;
}

export type { InputGlyphProps };
