/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { CatalogApi } from '../catalog.type';

const catalogApi = (): CatalogApi | null => hostApi()?.catalog ?? null;

export { catalogApi };
