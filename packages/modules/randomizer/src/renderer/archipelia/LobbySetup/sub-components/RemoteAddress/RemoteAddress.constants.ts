/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { PatternSlotConfigs } from '@drizztdourden08/tessera/composites';
import { hostNameMessage } from '../../../lobby-setup';

const HOST_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789.-';
const PORT_SLOT = '{port:number 1..65535}';
const HOST_PATTERN = `{kind:choice @kinds} {host:text max253 lower}:${PORT_SLOT}`;
const IP_PATTERN =
  `{kind:choice @kinds} {a:number 0..255}.{b:number 0..255}.{c:number 0..255}.{d:number 0..255}:${PORT_SLOT}`;
const ADDRESS_LABEL = msg('randomizer:lobby.address.label');
const KIND_LABELS = { host: msg('randomizer:lobby.address.host'), ip: msg('randomizer:lobby.address.ip') };
const SLOT_LABELS = {
  kind: msg('randomizer:lobby.address.kind'),
  host: msg('randomizer:lobby.address.host'),
  a: msg('randomizer:lobby.address.first'),
  b: msg('randomizer:lobby.address.second'),
  c: msg('randomizer:lobby.address.third'),
  d: msg('randomizer:lobby.address.fourth'),
  port: msg('randomizer:lobby.address.port'),
};
const HOST_PLACEHOLDER = msg('randomizer:lobby.address.hostPlaceholder');
const PORT_PLACEHOLDER = msg('randomizer:lobby.address.portPlaceholder');
const SLOT_RULES: PatternSlotConfigs = {
  host: { chars: HOST_CHARS, validate: hostNameMessage },
  a: { placeholder: '0' },
  b: { placeholder: '0' },
  c: { placeholder: '0' },
  d: { placeholder: '0' },
};

export { ADDRESS_LABEL, HOST_PATTERN, HOST_PLACEHOLDER, IP_PATTERN, KIND_LABELS, PORT_PLACEHOLDER, SLOT_LABELS, SLOT_RULES };
