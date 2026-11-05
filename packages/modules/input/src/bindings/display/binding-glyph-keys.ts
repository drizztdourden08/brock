/* @layer core @kind logic */
import type { ButtonIcon, InputBinding } from '../bindings.type';
import { AXIS_FALLBACK_GLYPHS } from './display.constants';
import { keyCodeToGlyph } from './key-code-to-glyph';

const fallbackGlyph = (binding: InputBinding): string | null => {
  if (binding.type === 'keyboard') return 'kb-any';
  if (binding.type === 'gamepad-button') return 'generic-btn';
  if (binding.type === 'gamepad-axis') {
    return AXIS_FALLBACK_GLYPHS[binding.axisIndex]?.[binding.direction] ?? 'generic-stick';
  }
  return null;
};

/** Glyph keys to ask the registered glyph source for, best match first. */
const bindingGlyphKeys = (binding: InputBinding, icon?: ButtonIcon | null): string[] => {
  if (binding.type === 'none') return [];
  const keys: (string | null | undefined)[] = [
    icon?.key,
    binding.type === 'keyboard' ? keyCodeToGlyph(binding.code) : null,
    fallbackGlyph(binding),
  ];
  return keys.filter((key): key is string => Boolean(key));
};

export { bindingGlyphKeys };
