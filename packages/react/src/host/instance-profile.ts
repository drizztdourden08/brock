/* @layer renderer-shell @kind logic */
import { hostApi } from './host-api';

const instanceProfile = (): string | null => hostApi()?.instance.profile ?? null;

export { instanceProfile };
