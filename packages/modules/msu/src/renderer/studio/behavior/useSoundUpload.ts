/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { sanitizeFileName, uniqueFileName } from './track-file-name';
import { failure } from './failure';
import type { ActionResult } from '../msu.type';
import type { SoundUploadParams } from './sound-upload.type';

const useSoundUpload = (params: SoundUploadParams) => {
  const { pack, files, reload } = params;
  const { store } = useMsuStudio();
  const t = useT();
  const [busy, setBusy] = useState(false);

  const upload = useCallback(async (dropped: File[]): Promise<ActionResult> => {
    if (!pack) return { success: false, message: t('msu:result.noPack') };
    if (dropped.length === 0) return { success: false, message: t('msu:result.noAudio') };

    const taken = new Set(files.map((file) => file.name));
    setBusy(true);
    try {
      const written: string[] = [];
      for (const file of dropped) {
        const name = uniqueFileName(sanitizeFileName(file.name), taken);
        await store.writeMsuTrackFile(pack, name, await file.arrayBuffer());
        taken.add(name);
        written.push(name);
      }
      return { success: true, message: t('msu:result.added', { count: written.length }) };
    } catch (err) {
      return failure(err, t('msu:result.addFailed'));
    } finally {
      setBusy(false);
      reload();
    }
  }, [pack, files, reload, store, t]);

  return { upload, uploading: busy };
};

export { useSoundUpload };
