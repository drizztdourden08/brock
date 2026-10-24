/* @layer electron-main @kind logic */
import { join } from 'path';
import type { DataDomainDef } from '@drizztdourden08/brock-core/platform';
import { createDataDomains as createDomains } from '../main/storage/create-data-domains';
import type { DataDomains } from '../main/storage/domain-files.type';

const createDataDomains = (dataDir: string, defs: readonly DataDomainDef[]): DataDomains => createDomains(defs, (dir) => join(dataDir, dir));

export { createDataDomains };
