/* @layer electron-main @kind logic */
import { ipcMain } from 'electron';
import { AppError, encodeAppError } from '@drizztdourden08/brock-core/ipc';
import type { HandleFn } from './handle.type';
import { channelName } from './channel-name';
import { ipcCallCount } from './ipc-call-count';

const handle: HandleFn = (channel, fn) => {
  const counted = async (...args: unknown[]): Promise<unknown> => {
    ipcCallCount.total += 1;
    try {
      return await (fn as (...a: unknown[]) => unknown)(...args);
    } catch (error) {
      throw error instanceof AppError ? new Error(encodeAppError(error), { cause: error }) : error;
    }
  };
  ipcMain.handle(channelName(channel), counted);
};

export { handle };
