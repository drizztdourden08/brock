/* @layer electron-main @kind logic */
import { networkInterfaces } from 'os';
import type { LanAddress } from '@drizztdourden08/brock-core/types';

const familyRank = (address: LanAddress): number => (address.family === 'IPv4' ? 0 : 1);

const lanAddresses = (): LanAddress[] =>
  Object.entries(networkInterfaces())
    .flatMap(([interfaceName, infos]) => (infos ?? [])
      .filter((info) => !info.internal)
      .map((info): LanAddress => ({ interfaceName, address: info.address, family: info.family, cidr: info.cidr })))
    .sort((a, b) => familyRank(a) - familyRank(b));

export { lanAddresses };
