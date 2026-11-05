/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import { ONLINE_MODE } from '../../online/online-mode.constants';
import { connectionOfValues } from '../../online/connection-step/connection-of-values';
import { connectionSummary } from '../../online/connection-step/connection-summary';
import { formOf } from '../../wizard/form-of';
import { connectionRows } from './connection-rows';
import { NONE_TEXT, REVIEW_TITLES } from './review.constants';

const connectionReviewRows = (values: ProfileWizardValues): FactsPanelFact[] =>
  formOf(values).mode === ONLINE_MODE
    ? connectionRows(connectionOfValues(values))
    : [{ label: REVIEW_TITLES.connection, value: connectionSummary(values) ?? NONE_TEXT }];

export { connectionReviewRows };
