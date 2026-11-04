/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import type { ReviewEnv } from '../review.type';

const bucketRoute = ({ screenTree }: ReviewEnv, hub: HubDef): string | null => {
  if (screenTree?.home === hub.id) return 'Home and Escape';
  return screenTree?.settingsBucket === hub.id ? 'the settings gear' : null;
};

export { bucketRoute };
