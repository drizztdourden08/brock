/* @layer renderer-shell @kind constants */
import type { DataImportMode } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { DialogChoiceInput } from '../../../stores/dialog.type';

const IMPORT_CHOICES: readonly DialogChoiceInput<DataImportMode>[] = [
  { value: 'merge', label: msg('brock-shell:storage.import.merge'), description: msg('brock-shell:storage.import.merge.description') },
  { value: 'replace', label: msg('brock-shell:storage.import.replace'), description: msg('brock-shell:storage.import.replace.description') },
];

export { IMPORT_CHOICES };
