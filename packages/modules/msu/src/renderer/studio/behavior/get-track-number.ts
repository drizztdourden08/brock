/* @layer renderer-shell @kind logic */
import { trackNumberOf } from '../../../paths';

const getTrackNumber = (filename: string): number | null => trackNumberOf(filename);

export { getTrackNumber };
