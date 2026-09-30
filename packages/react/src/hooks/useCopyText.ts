/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { COPIED_RESET_MS } from './copy-text.constants';
import type { CopyText } from './copy-text.type';

const useCopyText = (resetMs = COPIED_RESET_MS): CopyText => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(timer);
  }, [copied, resetMs]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setError(null);
      setCopied(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setCopied(false);
      return false;
    }
  }, []);

  return { copied, error, copy };
};

export { useCopyText };
