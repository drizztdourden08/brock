/* @layer renderer-shell @kind component */
import { useEffect, useMemo, useState } from 'react';
import { Button, Field, Flex, TextInput } from '@drizztdourden08/tessera/primitives';
import { useT } from '@drizztdourden08/brock-react';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { FactsPanelGroup } from '@drizztdourden08/tessera/composites';
import { formatBytes } from '@drizztdourden08/brock-core';
import { StudioSection } from '../../studio-kit';
import type { PackPropertiesProps } from './studio-frame.type';

const PackProperties = (props: PackPropertiesProps) => {
  const { pack, format, slotCount, fileCount, totalSize, isDeluxe, hasOpuz, busy, readOnly, onRename } = props;
  const t = useT();
  const [draftName, setDraftName] = useState(pack);

  useEffect(() => { setDraftName(pack); }, [pack]);
  const renameReady = !readOnly && draftName.trim().length > 0 && draftName.trim() !== pack;

  const groups = useMemo<FactsPanelGroup[]>(() => [[
    { label: t('msu:pack.format'), value: format === 'layered' ? t('msu:pack.layered') : t('msu:pack.classic') },
    { label: t('msu:pack.slots'), value: isDeluxe ? t('msu:pack.extended') : t('msu:pack.standard') },
    { label: t('msu:pack.slotsFilled'), value: slotCount, mono: true },
    { label: t('msu:pack.files'), value: fileCount, mono: true },
    { label: t('msu:pack.size'), value: formatBytes(totalSize), mono: true },
    ...(hasOpuz ? [{ label: t('msu:pack.audio'), value: t('msu:pack.needsConversion') }] : []),
  ]], [slotCount, fileCount, totalSize, isDeluxe, format, hasOpuz, t]);

  return (
    <StudioSection title={t('msu:pack.title')}>
      <Field label={t('msu:pack.name')}>
        <Flex gap="xs" align="center">
          <TextInput
            type="text"
            value={draftName}
            aria-label={t('msu:pack.nameLabel')}
            disabled={readOnly}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && renameReady && !busy) onRename(draftName); }}
          />
          <Button variant="secondary" size="sm" disabled={busy || !renameReady} onClick={() => onRename(draftName)}>
            {t('msu:pack.rename')}
          </Button>
        </Flex>
      </Field>
      <FactsPanel groups={groups} layout="rows" label={t('msu:pack.properties')} />
    </StudioSection>
  );
};

export { PackProperties };
