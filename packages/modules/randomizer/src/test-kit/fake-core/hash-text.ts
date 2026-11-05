/* @layer core @kind logic */
import { NO_ROOM } from './fake-core.constants';

const hashText = (hash: number): string => (hash === NO_ROOM ? '' : String(hash));

export { hashText };
