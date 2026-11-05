/* @layer renderer-shell @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { ConnectionForm } from '../../online/connection-step/connection-form.type';
import { NONE_TEXT } from './review.constants';

const connectionRows = ({ host, port, slotName, password }: ConnectionForm): FactsPanelFact[] => [
  { label: 'Server', value: host.trim() === '' ? NONE_TEXT : `${host.trim()}:${port}`, mono: true },
  { label: 'Name', value: slotName.trim() || NONE_TEXT },
  { label: 'Password', value: password === '' ? NONE_TEXT : 'Set' },
];

export { connectionRows };
