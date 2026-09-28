/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { Box, Button, Flex, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import type { CreateProfileFormProps } from './CreateProfileForm.type';
import './CreateProfileForm.css';

const CreateProfileForm = (props: CreateProfileFormProps) => {
  const {
    onCreate, onCancel, extraFields, canSubmit = true, error = null,
    placeholder = 'Profile name', submitLabel = 'Create',
  } = props;
  const [name, setName] = useState('');
  const ready = name.trim() !== '' && canSubmit;

  const handleSubmit = () => {
    if (ready) onCreate(name.trim());
  };

  return (
    <Box className="create-profile-form">
      <TextInput
        type="text"
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        autoFocus
      />
      {extraFields}
      {error && <Text className="create-profile-form__error">{error}</Text>}
      <Flex gap="sm" className="create-profile-form__actions">
        <Button variant="primary" fullWidth disabled={!ready} onClick={handleSubmit}>{submitLabel}</Button>
        {onCancel && <Button variant="tertiary" fullWidth onClick={onCancel}>Cancel</Button>}
      </Flex>
    </Box>
  );
};

export { CreateProfileForm };
