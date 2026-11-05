/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { MsuFileMetadata } from '../../../packs';
import { useMsuStudio } from '../../game/useMsuStudio';
import type { MsuFile } from '../msu.type';

const usePackMetadata = (pack: string, files: MsuFile[]) => {
  const { store } = useMsuStudio();
  const [metadata, setMetadata] = useState<MsuFileMetadata[]>([]);
  const [settledPack, setSettledPack] = useState<string | null>(null);

  useEffect(() => {
    if (files.length === 0) { setMetadata([]); setSettledPack(pack); return undefined; }
    let live = true;
    void store.getMsuFileMetadata(pack)
      .then((list) => { if (live) { setMetadata(list); setSettledPack(pack); } })
      .catch(() => { if (live) { setMetadata([]); setSettledPack(pack); } });
    return () => { live = false; };
  }, [store, pack, files]);

  return { metadata, settledPack };
};

export { usePackMetadata };
