/* @layer renderer-shell @kind component */
import { Span } from '@drizztdourden08/tessera/primitives';
import type { InputGlyphProps } from './InputGlyph.type';

const InputGlyph = (props: InputGlyphProps) => {
  const { kind, name, label } = props;
  return <Span className={`input-glyph input-glyph--${kind}`} title={name} data-input={name}>{label}</Span>;
};

export { InputGlyph };
