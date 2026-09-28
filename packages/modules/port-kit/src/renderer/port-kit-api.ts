/* @layer renderer-shell @kind logic */
import '../augment';
import { hostApi } from '@drizztdourden08/brock-react';
import type { PortKitApi } from '../port-kit.type';

const portKitApi = (): PortKitApi | null => hostApi()?.portKit ?? null;

export { portKitApi };
