/* @layer renderer-shell @kind component */
import { useT, useText } from '@drizztdourden08/brock-react';
import { Box, Button, Field, Flex, TextInput } from '@drizztdourden08/tessera/primitives';
import { HINT, INSTALLED_HINT } from './MsuPackToolbar.constants';
import type { MsuPackToolbarProps } from './MsuPackToolbar.type';

const MsuPackToolbar = (props: MsuPackToolbarProps) => {
  const { name, busy, nameInstalled, onNameChange, onCreate } = props;
  const t = useT();
  const text = useText();
  const blocked = busy || nameInstalled || !name.trim();

  return (
    <Box className="import-form">
      <Field label={t('msu:toolbar.packName')} hint={text(nameInstalled ? INSTALLED_HINT : HINT)}>
        <Flex gap="sm" align="center">
          <TextInput
            type="text"
            placeholder={t('msu:toolbar.placeholder')}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !blocked) onCreate(); }}
          />
          <Button variant="secondary" size="sm" disabled={blocked} onClick={onCreate}>
            Create Empty
          </Button>
        </Flex>
      </Field>
    </Box>
  );
};

export { MsuPackToolbar };
