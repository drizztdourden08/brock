/* @layer renderer-shell @kind constants */
import type { DataImportMode } from '@drizztdourden08/brock-core';
import type { DialogChoice } from '../../../stores/dialog.type';

const IMPORT_CHOICES: readonly DialogChoice<DataImportMode>[] = [
  { value: 'merge', label: 'Merge', description: 'Add the export to what is there. When both have a file at the same path, the newer one stays.' },
  { value: 'replace', label: 'Replace', description: 'Delete what is in these folders now and put the export in its place.' },
];

export { IMPORT_CHOICES };
