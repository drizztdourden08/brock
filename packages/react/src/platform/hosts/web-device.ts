/* @layer renderer-shell @kind logic */
import type { WebDevice } from '../platform.type';
import { mediaOf } from './media-of';
import { COARSE_QUERY, PHONE_QUERY } from './web-device.constants';

const webDevice = (): WebDevice => ({
  formFactor: mediaOf(PHONE_QUERY)?.matches === true ? 'mobile' : 'desktop',
  input: mediaOf(COARSE_QUERY)?.matches === true ? 'touch' : 'pointer',
});

export { webDevice };
