/* @layer renderer-shell @kind logic */
import { getPlatform } from '../../platform/get-platform';
import { useProfilesStore } from '../../stores/useProfilesStore';
import type { ShowContext } from './show.type';

const currentShowContext = (): ShowContext => {
  const { info } = getPlatform();
  return { profile: useProfilesStore.getState().active, host: info.host, formFactor: info.formFactor };
};

export { currentShowContext };
