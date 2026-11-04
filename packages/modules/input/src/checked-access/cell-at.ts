/* @layer renderer-shell @kind logic */
import { itemAt } from '@drizztdourden08/brock-core/util';

const cellAt = <T>(grid: ArrayLike<ArrayLike<T>>, row: number, col: number): T => itemAt(itemAt(grid, row), col);

export { cellAt };
