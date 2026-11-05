/* @layer electron-main @kind logic */
import type { PackWriteRefusal } from '../msu-main-options.type';

const refuseWrite = async (refusal: PackWriteRefusal | undefined, pack: string): Promise<void> => {
  const reason = await refusal?.(pack);
  if (reason) throw new Error(reason);
};

export { refuseWrite };
