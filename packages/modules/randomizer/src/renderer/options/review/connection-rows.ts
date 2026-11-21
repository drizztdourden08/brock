/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { ConnectionForm } from '../../online/connection-step/connection-form.type';
import { NONE_TEXT, REVIEW_LABELS } from './review.constants';

const connectionRows = ({ host, port, slotName, password }: ConnectionForm, text: (value: Text) => string): FactsPanelFact[] => [
  { label: text(REVIEW_LABELS.server), value: host.trim() === '' ? text(NONE_TEXT) : `${host.trim()}:${port}`, mono: true },
  { label: text(REVIEW_LABELS.name), value: slotName.trim() || text(NONE_TEXT) },
  { label: text(REVIEW_LABELS.password), value: password === '' ? text(NONE_TEXT) : text(REVIEW_LABELS.set) },
];

export { connectionRows };
