/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { MsuPackList } from '../studio/MsuPackList';
import { MsuPackToolbar } from '../studio/MsuPackToolbar';
import { ImportForm } from './import-form';
import { MSU_IMPORT_COPY } from './MsuListPane.constants';
import type { MsuListPaneProps } from './MsuListPane.type';

const MsuListPane = (props: MsuListPaneProps) => {
  const { section, msu, origin } = props;
  const nameInstalled = origin.nameTaken(msu.newPackName.trim());

  return (
    <>
      {section === 'create' && (
        <MsuPackToolbar
          name={msu.newPackName}
          busy={msu.busy}
          nameInstalled={nameInstalled}
          onNameChange={msu.setNewPackName}
          onCreate={msu.handleCreatePack}
        />
      )}
      {section === 'import' && (
        <ImportForm
          kind="msu"
          {...MSU_IMPORT_COPY}
          disabled={nameInstalled}
          onUrlImport={msu.handleUrlImport}
          onFileImport={msu.handleFileImport}
        />
      )}
      {section === 'packs' && (
        <>
          {origin.error !== null && <Text variant="caption" tone="danger" role="alert">{origin.error}</Text>}
          <MsuPackList
            loading={msu.loadingPacks}
            packs={msu.packs}
            selected={msu.selected}
            isInstalled={origin.isInstalled}
            badge={origin.badge}
            onSelect={msu.setSelected}
            onDelete={origin.onDelete}
          />
        </>
      )}
    </>
  );
};

export { MsuListPane };
