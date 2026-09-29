/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { SELECTORS } from '../review.constants';
import { find } from './find';

const isClosed = (): boolean => find(SELECTORS.layer) === null && nav.active() === null;

export { isClosed };
