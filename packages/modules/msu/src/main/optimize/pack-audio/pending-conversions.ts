/* @layer electron-main @kind logic */
import type { MsuPackFile } from '../../../packs';
import { isTargetFormat, supersededMap } from '../../../superseded';

const pendingConversions = (audio: MsuPackFile[]): MsuPackFile[] => {
  const covered = supersededMap(audio.map((file) => file.name));
  return audio.filter((file) => !isTargetFormat(file.name) && !covered.has(file.name));
};

export { pendingConversions };
