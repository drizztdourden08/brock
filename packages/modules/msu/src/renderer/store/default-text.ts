/* @layer renderer-shell @kind logic */
import type { StoreText } from './msu-store.type';

const defaultText: StoreText = (value) => (typeof value === 'string' ? value : value.key);

export { defaultText };
