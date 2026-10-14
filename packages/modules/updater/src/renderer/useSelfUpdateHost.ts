/* @layer renderer-shell @kind hook */
import { usePlatform } from '@drizztdourden08/brock-react';
import { selfUpdateHost } from './self-update-host';

const useSelfUpdateHost = (): boolean => selfUpdateHost(usePlatform().capabilities);

export { useSelfUpdateHost };
