/* @layer core @kind logic */
import { BENIGN_BROWSER_ERRORS } from './benign-browser-errors.constants';

const isBenignBrowserError = (message: string): boolean => BENIGN_BROWSER_ERRORS.includes(message);

export { isBenignBrowserError };
