/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';

const useToastEntries = <T extends { id: string }>() => {
  const [entries, setEntries] = useState<readonly T[]>([]);
  const dismiss = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);
  return { entries, setEntries, dismiss };
};

export { useToastEntries };
