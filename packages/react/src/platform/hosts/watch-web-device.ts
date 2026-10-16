/* @layer renderer-shell @kind logic */
import type { WebDevice } from '../platform.type';
import { mediaOf } from './media-of';
import { webDevice } from './web-device';
import { COARSE_QUERY, PHONE_QUERY } from './web-device.constants';

const watchWebDevice = (onChange: (device: WebDevice) => void): (() => void) => {
  const lists = [mediaOf(PHONE_QUERY), mediaOf(COARSE_QUERY)].filter((list): list is MediaQueryList => list !== null);
  const listener = (): void => onChange(webDevice());
  for (const list of lists) list.addEventListener('change', listener);
  return () => {
    for (const list of lists) list.removeEventListener('change', listener);
  };
};

export { watchWebDevice };
