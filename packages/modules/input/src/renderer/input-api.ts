/* @layer renderer-shell @kind logic */
import type { InputApi } from '../input-api.type';
import { noopInputApi } from '../noop-input-api';
import { hostInputApi } from './host-input-api';

const inputApi = (): InputApi => hostInputApi() ?? noopInputApi;

export { inputApi };
