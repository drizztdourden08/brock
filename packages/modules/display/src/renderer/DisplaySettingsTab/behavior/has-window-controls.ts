/* @layer renderer-shell @kind logic */
import { detectHost } from '@drizztdourden08/brock-core';

const hasWindowControls = (): boolean => detectHost() !== 'capacitor';

export { hasWindowControls };
