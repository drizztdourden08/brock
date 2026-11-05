/* @layer renderer-shell @kind logic */
import type { FormLabels } from '../check/form-labels.type';
import { archipeliaOf } from './archipelia-of';

const formLabelsOf = (): FormLabels => {
  const { archipelia, game } = archipeliaOf();
  return { game, shortName: archipelia.client.shortName };
};

export { formLabelsOf };
