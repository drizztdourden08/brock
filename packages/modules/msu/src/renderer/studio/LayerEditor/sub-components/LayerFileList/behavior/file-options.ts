/* @layer renderer-shell @kind logic */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

const fileOptions = (available: readonly string[], files: readonly string[]): SelectOption[] =>
  available.filter((name) => !files.includes(name)).map((name) => ({ value: name, label: name }));

export { fileOptions };
