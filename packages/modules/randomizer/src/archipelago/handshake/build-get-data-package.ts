/* @layer core @kind logic */
import type { ApGetDataPackagePacket } from '../protocol/client-packets.type';

const buildGetDataPackage = (games: string[]): ApGetDataPackagePacket => ({
  cmd: 'GetDataPackage',
  games,
});

export { buildGetDataPackage };
