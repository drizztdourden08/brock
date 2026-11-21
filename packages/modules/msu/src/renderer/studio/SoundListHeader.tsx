/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { Button, SectionHeader, Text } from '@drizztdourden08/tessera/primitives';
import type { SoundListHeaderProps } from './SoundListHeader.type';
import './SoundListHeader.css';

const SoundListHeader = (props: SoundListHeaderProps) => {
  const { title, sounding, status, statusOk, onStop } = props;
  const t = useT();

  return (
    <>
      <SectionHeader
        title={title}
        action={sounding ? <Button variant="tertiary" size="sm" onClick={onStop}>{t('msu:ui.stopPreview')}</Button> : null}
      />
      {status != null && <Text className={`msu-status${statusOk ? '' : ' msu-status--error'}`}>{status}</Text>}
    </>
  );
};

export { SoundListHeader };
