/* @layer renderer-shell @kind logic */
import { hostApi } from './host-api';

const instanceName = (): string | null => hostApi()?.instance.name ?? null;

export { instanceName };
