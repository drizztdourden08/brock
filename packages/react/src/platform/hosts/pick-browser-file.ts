/* @layer renderer-shell @kind logic */
import type { PickedFile } from '@drizztdourden08/brock-core';

const pickBrowserFile = (opts?: { extensions?: string[] }): Promise<PickedFile | null> => new Promise((resolve) => {
  const input = document.createElement('input');
  input.type = 'file';
  if (opts?.extensions?.length) input.accept = opts.extensions.map((e) => `.${e}`).join(',');
  input.onchange = async () => {
    const file = input.files?.[0];
    resolve(file ? { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) } : null);
  };
  input.click();
});

export { pickBrowserFile };
