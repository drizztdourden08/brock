/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, Text } from '@drizztdourden08/tessera/primitives';
import type { LayerEditorFooterProps } from './LayerEditorFooter.type';

const LayerEditorFooter = (props: LayerEditorFooterProps) => {
  const { locked, dirty, saving, onSave, onRevert } = props;
  const t = useT();
  return (
    <ButtonRow align="start">
      <Button variant="primary" size="sm" disabled={locked || !dirty} onClick={onSave}>
        {saving ? t('msu:layer.saving') : t('msu:layer.save')}
      </Button>
      <Button variant="tertiary" size="sm" disabled={locked || !dirty} onClick={onRevert}>{t('msu:layer.revert')}</Button>
      {dirty && !saving && <Text variant="caption">{t('msu:layer.unsaved')}</Text>}
    </ButtonRow>
  );
};

export { LayerEditorFooter };
