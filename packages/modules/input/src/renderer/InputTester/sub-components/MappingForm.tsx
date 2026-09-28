/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { Button, Flex, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { useControllerDevicesStore } from '../../useControllerDevicesStore';

const MappingForm = () => {
  const addMapping = useControllerDevicesStore((s) => s.addMapping);
  const [line, setLine] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleAdd = useCallback(async () => {
    const ok = await addMapping(line);
    setResult(ok ? 'Mapping added and saved.' : 'That line is not a valid mapping.');
    if (ok) setLine('');
  }, [addMapping, line]);

  return (
    <Flex direction="column" gap="xs">
      <Text variant="label">Add a gamecontrollerdb mapping line</Text>
      <Flex gap="sm" align="center">
        <TextInput
          value={line}
          placeholder="GUID,Name,a:b0,b:b1,..."
          aria-label="Mapping line"
          onChange={(event) => setLine(event.target.value)}
        />
        <Button variant="secondary" size="sm" disabled={line.trim() === ''} onClick={() => { void handleAdd(); }}>
          Add
        </Button>
      </Flex>
      {result && <Text variant="caption">{result}</Text>}
    </Flex>
  );
};

export { MappingForm };
