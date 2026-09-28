/* @layer renderer-shell @kind hook */
import { useEffect, useMemo, useState } from 'react';
import type { SelectGroup } from '@drizztdourden08/tessera/primitives';
import type { VersionChoice, VersionChoiceInput } from '../UpdateDialog.type';
import { RELEASES_GROUP } from '../UpdateDialog.constants';
import { actionFor } from './action-for';
import { describeVersion } from './describe-version';

const useVersionChoice = ({ open, info, versions, loadVersions }: VersionChoiceInput): VersionChoice => {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (open) loadVersions().catch(() => undefined);
  }, [open, loadVersions]);

  useEffect(() => {
    if (selected) return;
    const preferred = info?.version ?? versions[0]?.version;
    if (preferred) setSelected(preferred);
  }, [selected, info, versions]);

  const groups = useMemo<SelectGroup[]>(() => (versions.length === 0 ? [] : [{
    label: RELEASES_GROUP,
    options: versions.map((v) => ({ value: v.version, label: v.version, description: describeVersion(v) })),
  }]), [versions]);

  const chosen = versions.find((v) => v.version === selected) ?? null;
  const isLatest = versions[0]?.version === selected;

  return { selected, setSelected, groups, chosen, isLatest, action: actionFor(chosen) };
};

export { useVersionChoice };
