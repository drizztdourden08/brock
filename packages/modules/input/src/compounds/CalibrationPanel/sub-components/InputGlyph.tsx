/* @layer renderer-shell @kind component */
import { InputIcon, Span } from '@drizztdourden08/tessera/primitives';
import { controlIcon } from '../behavior/control-icon';
import { READING_ICON_SIZE } from '../CalibrationPanel.constants';
import type { InputGlyphProps } from './InputGlyph.type';

const InputGlyph = (props: InputGlyphProps) => {
  const { family, kind, name, label } = props;
  const icon = controlIcon(family, kind, name);
  if (icon) return <InputIcon {...icon} size={READING_ICON_SIZE} tone="theme" label={label} data-input={name} />;
  return <Span className={`input-glyph input-glyph--${kind}`} title={name} data-input={name}>{label}</Span>;
};

export { InputGlyph };
