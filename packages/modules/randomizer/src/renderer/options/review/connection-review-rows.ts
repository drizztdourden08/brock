/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import { ONLINE_MODE } from '../../online/online-mode.constants';
import { connectionOfValues } from '../../online/connection-step/connection-of-values';
import { connectionSummary } from '../../online/connection-step/connection-summary';
import { formOf } from '../../wizard/form-of';
import { connectionRows } from './connection-rows';
import { NONE_TEXT, REVIEW_TITLES } from './review.constants';

const connectionReviewRows = (values: ProfileWizardValues, text: (value: Text) => string): FactsPanelFact[] =>
  formOf(values).mode === ONLINE_MODE
    ? connectionRows(connectionOfValues(values), text)
    : [{ label: text(REVIEW_TITLES.connection), value: connectionSummary(values) ?? text(NONE_TEXT) }];

export { connectionReviewRows };
