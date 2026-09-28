/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { DisplayApi } from '../display.type';

const displayApi = (): DisplayApi | null => hostApi()?.display ?? null;

export { displayApi };
