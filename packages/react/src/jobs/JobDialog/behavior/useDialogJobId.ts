/* @layer renderer-shell @kind hook */
import { useLayoutEffect, useState } from 'react';
import { DIALOG_SELECTOR, JOB_ID_ATTRIBUTE } from '../JobDialog.constants';

const useDialogJobId = (id: string): ((node: HTMLElement | null) => void) => {
  const [marker, setMarker] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const dialog = marker?.closest(DIALOG_SELECTOR);
    if (!dialog) return undefined;
    dialog.setAttribute(JOB_ID_ATTRIBUTE, id);
    return () => dialog.removeAttribute(JOB_ID_ATTRIBUTE);
  }, [marker, id]);

  return setMarker;
};

export { useDialogJobId };
