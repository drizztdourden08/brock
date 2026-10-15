/* @layer renderer-shell @kind logic */
import type { FilePickerPort } from '@drizztdourden08/brock-core';
import { pickBrowserFile } from '../pick-browser-file';
import { base64 } from './base64';
import { capacitorPlugins } from './capacitor-plugins';
import { DOCUMENTS_DIRECTORY } from './capacitor.constants';

const createCapacitorFilePicker = (): FilePickerPort => ({
  pickFile: (opts) => pickBrowserFile(opts, { host: 'capacitor', formFactor: 'mobile' }),
  saveFile: async ({ name, bytes }) => {
    const files = capacitorPlugins.files();
    if (!files) return { saved: false, error: 'The Filesystem plugin is not installed' };
    try {
      await files.writeFile({ path: name, directory: DOCUMENTS_DIRECTORY, data: base64.encode(bytes), recursive: true });
      return { saved: true, name };
    } catch (err) {
      return { saved: false, error: err instanceof Error ? err.message : String(err) };
    }
  },
});

export { createCapacitorFilePicker };
