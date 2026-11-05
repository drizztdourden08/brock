/* @layer renderer-shell @kind component */
import { ArchipeliaFields } from '../ArchipeliaFields';
import { lobbyFormOfConnection } from '../lobby-form-of-connection';
import type { LobbyForm } from '../lobby-form.type';
import type { ArchipeliaConnectionProps } from './ArchipeliaConnection.type';

const ArchipeliaConnection = ({ value, onChange }: ArchipeliaConnectionProps) => (
  <ArchipeliaFields
    value={lobbyFormOfConnection(value)}
    onChange={(part: Partial<LobbyForm>) => onChange(part)}
  />
);

export { ArchipeliaConnection };
