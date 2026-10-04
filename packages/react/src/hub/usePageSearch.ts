/* @layer renderer-shell @kind hook */
import { useScreenState } from '../screens/useScreenState';
import { PAGE_SEARCH_KEY } from './hub.constants';

const usePageSearch = (): string => useScreenState(PAGE_SEARCH_KEY, '')[0];

export { usePageSearch };
