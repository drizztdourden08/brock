/* @layer core @kind logic */
import type { CatalogJobSource } from '../catalog.type';
import { catalogJobId } from './catalog-job-id';

const isCatalogInstalling = (itemId: string, jobs: CatalogJobSource): boolean => {
  const id = catalogJobId(itemId);
  const list = 'list' in jobs ? jobs.list() : jobs;
  return list.some((job) => job.id === id && job.state === 'running');
};

export { isCatalogInstalling };
