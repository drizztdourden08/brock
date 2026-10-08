/* @layer core @kind logic */
import { assertRomFileName } from './assert-rom-file-name';

const romFileNameOf = (fileName: string): string => assertRomFileName(fileName.split(/[\\/]/).pop()?.trim() ?? '');

export { romFileNameOf };
