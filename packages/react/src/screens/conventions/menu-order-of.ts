/* @layer renderer-shell @kind logic */
import { UNORDERED } from './screens.constants';

const menuOrderOf = (entry: { order?: number; menuOrder?: number }): number => entry.menuOrder ?? entry.order ?? UNORDERED;

export { menuOrderOf };
