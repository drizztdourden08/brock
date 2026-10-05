/* @layer tooling-scripts @kind logic */
import { importMoves } from '../../src/upgrade/index.mjs';

const PRIMITIVES = '@drizztdourden08/tessera/primitives';

const COMPOSITES = '@drizztdourden08/tessera/composites';

const BRAND = '@drizztdourden08/tessera/brand';

const TO_COMPOSITES = [
  'Video', 'VideoProps',
  'Splash', 'SplashAction', 'SplashBar', 'SplashProgress', 'SplashProps',
  'ShortcutList', 'ShortcutGesture', 'ShortcutListGroup', 'ShortcutListItem', 'ShortcutListProps',
  'CodeBlock', 'CodeBlockLanguage', 'CodeBlockProps',
  'RetryButton', 'RetryButtonProps',
  'CommandInput', 'CommandInputProps', 'CommandSubmit',
  'PasswordInput', 'PasswordInputProps', 'PasswordMode', 'PasswordRule', 'PasswordScore', 'PasswordStrength', 'PasswordStrengthLevel',
  'TagInput', 'TagInputProps', 'TagAdvice', 'TagValidationResult', 'TagValidator', 'namespacedTag',
  'Toast', 'ToastContainer', 'ToastAction', 'ToastContainerProps', 'ToastItem', 'ToastPosition', 'ToastProps', 'ToastVariant',
  'PathField', 'PathFieldProps', 'PathInput', 'PathInputProps', 'PathBrowse', 'PathKind',
];

const TO_BRAND = [
  'PixelWordmark', 'buildPixelWordmark', 'PIXEL_FONT', 'PixelGlyph', 'PixelWordmarkArt', 'PixelWordmarkColors', 'PixelWordmarkPath', 'PixelWordmarkProps',
  'PixelWordmarkSize',
];

const MOVES = Object.freeze([
  { from: PRIMITIVES, to: COMPOSITES, names: new Set(TO_COMPOSITES) },
  { from: COMPOSITES, to: PRIMITIVES, names: new Set(['Overlay', 'OverlayProps', 'OverlayTone']) },
  { from: COMPOSITES, to: BRAND, names: new Set(TO_BRAND) },
]);

const NO_TYPESCRIPT = 'Tessera 0.20 moved Splash, Toast, ToastContainer, ShortcutList, CodeBlock, Video, RetryButton, CommandInput, PasswordInput, TagInput and PathField (now PathInput) to @drizztdourden08/tessera/composites, Overlay to /primitives and PixelWordmark to /brand. TypeScript is not installed, so this file was not read: move those imports by hand, or import them from @drizztdourden08/tessera.';

const migration = Object.freeze({
  id: 'tessera-tier-moves',
  summary: 'Tessera 0.20 moved Splash, Toast, ToastContainer, ShortcutList, CodeBlock, Video, RetryButton, CommandInput, PasswordInput, TagInput, PathField and their types from /primitives to /composites, Overlay to /primitives and PixelWordmark to /brand. RENAMES.json names no entry point, so imports through the old one move here, before the Tessera renames turn PathField into PathInput; the root import is left alone.',
  files: /(^|\/)src\/.+\.[cm]?[jt]sx?$/,
  apply: importMoves({ moves: MOVES, noTypescript: NO_TYPESCRIPT }),
});

export { migration };
