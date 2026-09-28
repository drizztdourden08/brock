/* @layer renderer-shell @kind component */
import { Button, Flex, SectionHeader } from '@drizztdourden08/tessera/primitives';
import { useInputTester } from './behavior/useInputTester';
import { DeviceList } from './sub-components/DeviceList';
import { MappingForm } from './sub-components/MappingForm';
import './InputTester.css';

const InputTester = () => {
  const { entries, available, loaded, rescanPending, handleRescan, subtitle } = useInputTester();

  return (
    <Flex direction="column" gap="lg" className="input-tester">
      <SectionHeader
        title="Controllers"
        subtitle={subtitle}
        action={(
          <Button variant="secondary" size="sm" disabled={!available || rescanPending} onClick={handleRescan}>
            {rescanPending ? 'Scanning' : 'Rescan'}
          </Button>
        )}
      />
      <DeviceList entries={entries} available={available} loaded={loaded} />
      {available && <MappingForm />}
    </Flex>
  );
};

export { InputTester };
