/* @layer renderer-shell @kind logic */
import { anyTypeFor } from '@drizztdourden08/brock-core';
import type { PickedFile, PickFileOptions, PlatformInfo } from '@drizztdourden08/brock-core';

const pickBrowserFile = (opts: PickFileOptions | undefined, on: Pick<PlatformInfo, 'host' | 'formFactor'>): Promise<PickedFile | null> => new Promise((resolve) => {
  const input = document.createElement('input');
  input.type = 'file';
  if (opts?.extensions?.length && !anyTypeFor(opts.anyType, on)) input.accept = opts.extensions.map((e) => `.${e}`).join(',');
  input.onchange = async () => {
    const file = input.files?.[0];
    resolve(file ? { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) } : null);
  };
  input.click();
});

export { pickBrowserFile };
