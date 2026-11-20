/* @layer electron-main @kind logic */
import type { LegacyClipboard } from './electron-clipboard.type';

const isLegacyClipboard = (board: object): board is LegacyClipboard =>
  'readBuffer' in board && typeof board.readBuffer === 'function' && 'availableFormats' in board && typeof board.availableFormats === 'function' && 'writeBuffer' in board && typeof board.writeBuffer === 'function';

export { isLegacyClipboard };
