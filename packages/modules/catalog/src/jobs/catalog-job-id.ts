/* @layer core @kind logic */
import { CATALOG_JOB_PREFIX } from '../catalog.constants';

const catalogJobId = (itemId: string): string => `${CATALOG_JOB_PREFIX}${itemId}`;

export { catalogJobId };
