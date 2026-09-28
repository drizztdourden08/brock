/* @layer electron-main @kind logic */
import type { MainLogLevel } from '../logs/main-log-file.type';
import { note } from './note';

const noteSync = (level: MainLogLevel, message: string): void => note(level, message, { sync: true });

export { noteSync };
