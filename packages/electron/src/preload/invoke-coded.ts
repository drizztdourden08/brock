/* @layer electron-main @kind logic */
import { ipcRenderer } from 'electron';
import { decodeAppError, encodeAppError } from '@drizztdourden08/brock-core/ipc';

const invokeCoded = async (channel: string, args: readonly unknown[]): Promise<unknown> => {
  try {
    return await ipcRenderer.invoke(channel, ...args);
  } catch (error) {
    const coded = error instanceof Error ? decodeAppError(error.message) : undefined;
    if (coded === undefined) throw error;
    throw new Error(encodeAppError(coded), { cause: error });
  }
};

export { invokeCoded };
