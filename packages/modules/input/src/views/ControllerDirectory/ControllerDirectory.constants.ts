/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { TableColumn } from '@drizztdourden08/tessera/data';
import type { DirectoryRow } from './ControllerDirectory.type';

const SEARCH_PLACEHOLDER = msg('input:directory.search.placeholder');

const SEARCH_LABEL = msg('input:directory.search.label');

const EMPTY_MESSAGE = msg('input:directory.empty');

const COUNT_LABEL: readonly [Text, Text] = [msg('input:directory.count.one'), msg('input:directory.count.other')];

const SAMPLE_ROW: DirectoryRow = {
  id: '', name: '', vidPid: '', family: 'generic', source: 'builtin', inputs: 0, group: 'known', connectedKey: null,
};

const DIRECTORY_COLUMN_LABELS = {
  name: msg('input:directory.column.name'),
  vidPid: msg('input:directory.column.vidPid'),
  family: msg('input:directory.column.family'),
  source: msg('input:directory.column.source'),
  inputs: msg('input:directory.column.inputs'),
  group: msg('input:directory.column.group'),
} as const;

const DIRECTORY_FAMILY_OPTIONS: readonly { value: string; label: Text }[] = [
  { value: 'xbox', label: msg('input:directory.family.xbox') },
  { value: 'playstation', label: msg('input:directory.family.playstation') },
  { value: 'nintendo', label: msg('input:directory.family.nintendo') },
  { value: 'generic', label: msg('input:directory.family.generic') },
];

const DIRECTORY_SOURCE_OPTIONS: readonly { value: string; label: Text }[] = [
  { value: 'builtin', label: msg('input:directory.source.builtin') },
  { value: 'bundled', label: msg('input:directory.source.bundled') },
  { value: 'user', label: msg('input:directory.source.user') },
  { value: 'none', label: msg('input:directory.source.none') },
];

const DIRECTORY_GROUP_OPTIONS: readonly { value: string; label: Text }[] = [
  { value: 'connected', label: msg('input:directory.group.connected') },
  { value: 'known', label: msg('input:directory.group.known') },
];

const DIRECTORY_COLUMNS: readonly TableColumn[] = [
  { path: 'name', grow: true },
  { path: 'vidPid', fit: true },
  { path: 'family', fit: true },
  { path: 'source', fit: true },
  { path: 'inputs', fit: true },
];

const DIRECTORY_GROUP_BY: readonly string[] = ['group'];

const DIRECTORY_EXPANDED: readonly string[] = ['connected'];

const DIRECTORY_VIRTUALIZE_FROM = 100;

export {
  COUNT_LABEL, DIRECTORY_COLUMN_LABELS, DIRECTORY_COLUMNS, DIRECTORY_EXPANDED, DIRECTORY_FAMILY_OPTIONS, DIRECTORY_GROUP_BY,
  DIRECTORY_GROUP_OPTIONS, DIRECTORY_SOURCE_OPTIONS, DIRECTORY_VIRTUALIZE_FROM, EMPTY_MESSAGE, SAMPLE_ROW, SEARCH_LABEL, SEARCH_PLACEHOLDER,
};
