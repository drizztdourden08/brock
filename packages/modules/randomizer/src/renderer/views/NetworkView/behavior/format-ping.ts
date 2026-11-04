/* @layer renderer-shell @kind logic */
import { UNKNOWN_LABEL } from '../NetworkView.constants';

const formatPing = (pingMs: number | undefined): string => (pingMs === undefined ? UNKNOWN_LABEL : `${Math.round(pingMs)} ms`);

export { formatPing };
