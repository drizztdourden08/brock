/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { ListDetailLayout } from '@drizztdourden08/tessera/composites';
import { MsuStudio } from '../studio/MsuStudio';
import { useMsuManager } from '../studio/useMsuManager';
import { MUSIC_TAB } from '../studio/sound-labels/sound-labels.constants';
import { NO_PACK_MESSAGE } from '../studio/studio-frame/studio-frame.constants';
import type { StudioTab } from '../studio/sound-labels';
import { MsuListPane } from './MsuListPane';
import { PACK_SECTIONS } from './MsuStudioPage.constants';
import { useLocalPackOrigin } from './useLocalPackOrigin';
import type { MsuStudioBodyProps } from './MsuStudioPage.type';

const MsuStudioBody = (props: MsuStudioBodyProps) => {
  const { onDeleteConfirm, onRefresh, useOrigin = useLocalPackOrigin } = props;
  const msu = useMsuManager(onRefresh);
  const { selected, setSelected, refresh } = msu;
  const [tab, setTab] = useState<StudioTab>(MUSIC_TAB.id);

  const refreshThenSelect = useCallback((name: string) => {
    void refresh().then(() => setSelected(name));
  }, [refresh, setSelected]);

  const origin = useOrigin({ selected, setSelected, refresh, refreshThenSelect, onDeleteConfirm });

  const studio = selected && (
    <MsuStudio
      msu={msu}
      pack={selected}
      readOnly={origin.readOnly}
      origin={origin.banner}
      tab={tab}
      onTabChange={setTab}
      onDeleteConfirm={onDeleteConfirm}
    />
  );

  return (
    <ListDetailLayout
      listShowTitle={false}
      listContainers={PACK_SECTIONS.map(({ section, title }) => ({
        title,
        content: <MsuListPane section={section} msu={msu} origin={origin} />,
      }))}
      detail={studio}
      emptyDetail={<EmptyState message={NO_PACK_MESSAGE} />}
      detailScroll={false}
      storageKey="msu-studio.list"
      listLabel="MSU studio"
      detailLabel="Music editor"
    />
  );
};

export { MsuStudioBody };
