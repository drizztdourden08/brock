/* @layer tooling-scripts @kind logic */
import { blendHex } from './blend-hex.mjs';
import { FALLBACK_INK, STAMP_HAIRLINE_SHARE, TRACK_SURFACE_SHARE, VIA_SHARE } from './installer.constants.mjs';
import { pickInk } from './pick-ink.mjs';

/**
 * @typedef {object} StubColours
 * @property {string} bg @property {string} surface @property {string} hairline
 * @property {string} text @property {string} dim @property {string} faint
 * @property {string} accent @property {string} onAccent
 * @property {string} track @property {string} stamp
 * @property {string} from @property {string} via @property {string} to
 * @property {number} angle @property {string} ink  text on the gradient
 */

/**
 * @param {import('@drizztdourden08/brock-core/look').ResolvedLook & { ink?: string }} look
 * @param {import('./read-theme-tokens.mjs').ThemeTokens} theme
 * @returns {StubColours}
 */
const stubColours = (look, theme) => {
  const accent = look.accent.toLowerCase();
  const onAccent = theme.primary === accent ? theme.onPrimary : pickInk(accent, [theme.onPrimary, theme.text]);
  return {
    bg: theme.bg,
    surface: theme.surface,
    hairline: theme.hairline,
    text: theme.text,
    dim: theme.textDim,
    faint: theme.textFaint,
    accent,
    onAccent,
    track: theme.track ?? blendHex(theme.surface, theme.hairline, TRACK_SURFACE_SHARE),
    stamp: theme.stamp ?? blendHex(theme.hairline, theme.textFaint, STAMP_HAIRLINE_SHARE),
    from: look.from.toLowerCase(),
    via: (look.via ?? blendHex(look.from, look.to, VIA_SHARE)).toLowerCase(),
    to: look.to.toLowerCase(),
    angle: look.angle,
    ink: (look.ink ?? FALLBACK_INK).toLowerCase(),
  };
};

export { stubColours };
