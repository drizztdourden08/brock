/* @layer renderer-shell @kind logic */
import { hostInputApi } from './host-input-api';

const isInputAvailable = (): boolean => hostInputApi() !== null;

export { isInputAvailable };
