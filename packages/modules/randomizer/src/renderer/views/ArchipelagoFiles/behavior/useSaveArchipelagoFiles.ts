/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import { requireHostApi } from '@drizztdourden08/brock-react';
import { worldPackageFor } from '../../../archipelia';
import type { ArchipelagoFilesProps } from '../ArchipelagoFiles.type';
import { noPackageFeedback } from './no-package-feedback';
import { feedbackOf } from './save-feedback';
import type { SaveFeedback } from './save-feedback.type';

const useSaveArchipelagoFiles = (source: ArchipelagoFilesProps) => {
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<SaveFeedback | null>(null);

  const save = async (): Promise<void> => {
    setSaving(true);
    setFeedback(null);
    try {
      const apworld = await worldPackageFor(source.apVersion);
      if (apworld === null) {
        setFeedback(noPackageFeedback(source.apVersion, source.supportedVersions));
        return;
      }
      const { slotName, yaml, notice } = source.fileOf();
      const result = await requireHostApi().randomizer.saveArchipelagoFiles({ slotName, yaml, apworld, moduleName: source.moduleName });
      setFeedback(feedbackOf(result, notice));
    } catch (err) {
      setFeedback({ tone: 'error', text: `Not saved: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setSaving(false);
    }
  };

  return { saving, feedback, save };
};

export { useSaveArchipelagoFiles };
