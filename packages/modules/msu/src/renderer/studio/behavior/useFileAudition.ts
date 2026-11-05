/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { stopFileAudition } from '../../audition';
import type { Audition } from '../../audition';
import { runFileAudition } from './run-file-audition';
import type { MsuFile } from '../msu.type';

const useFileAudition = (pack: string, files: MsuFile[]) => {
  const { store } = useMsuStudio();
  const [playing, setPlaying] = useState<string | null>(null);
  const [audition, setAudition] = useState<Audition | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [loops, setLoops] = useState<Map<string, number | null>>(new Map());
  const latest = useRef(0);

  useEffect(() => () => { stopFileAudition(); }, []);

  const shownPack = useRef(pack);
  useEffect(() => {
    const present = shownPack.current === pack ? new Set(files.map((file) => file.name)) : new Set<string>();
    shownPack.current = pack;
    setLoops((known) => {
      const kept = new Map([...known].filter(([name]) => present.has(name)));
      return kept.size === known.size ? known : kept;
    });
    setPlaying((name) => {
      if (name === null || present.has(name)) return name;
      latest.current += 1;
      stopFileAudition();
      setAudition(null);
      return null;
    });
  }, [pack, files]);

  const stop = useCallback(() => {
    latest.current += 1;
    stopFileAudition();
    setPlaying(null);
    setAudition(null);
  }, []);

  const toggle = useCallback((fileName: string) => {
    if (playing === fileName) { stop(); return; }
    latest.current += 1;
    const press = latest.current;
    setLoading(fileName);
    void runFileAudition({
      fileName,
      read: () => store.readMsuTrackFile(pack, fileName),
      isCurrent: () => latest.current === press,
      setters: { setPlaying, setAudition, setLoading, setLoops },
    });
  }, [store, pack, playing, stop]);

  return {
    playing,
    audition,
    loading,
    loopOf: useCallback((fileName: string) => loops.get(fileName), [loops]),
    toggle,
    stop,
  };
};

export { useFileAudition };
