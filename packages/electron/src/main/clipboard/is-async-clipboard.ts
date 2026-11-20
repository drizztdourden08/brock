/* @layer electron-main @kind logic */
import type { AsyncClipboard } from './electron-clipboard.type';

const isAsyncClipboard = (board: object): board is AsyncClipboard =>
  'read' in board && typeof board.read === 'function' && 'readText' in board && typeof board.readText === 'function' && 'write' in board && typeof board.write === 'function' && 'clear' in board && typeof board.clear === 'function';

export { isAsyncClipboard };
