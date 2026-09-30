/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { UpdateSummaryProps } from '../UpdateDialog.type';

const UpdateSummary = (props: UpdateSummaryProps) => {
  const { status, info, currentVersion, capabilities } = props;

  if (!capabilities.hasSource) {
    return <Text as="p" className="update-dialog__status">This app has no update source, so it cannot check for updates.</Text>;
  }
  if (!capabilities.canCheck) {
    return <Text as="p" className="update-dialog__status">This build does not check for updates.</Text>;
  }

  return (
    <>
      {status === 'checking' && <Text as="p" className="update-dialog__status">Checking for newer version...</Text>}
      {info && (
        <Text as="p" className="update-dialog__version">
          Version <Text as="strong">{info.version}</Text> is available
        </Text>
      )}
      {status !== 'checking' && !info && (
        <Text as="p" className="update-dialog__version">
          Version <Text as="strong">{currentVersion}</Text> is the latest
        </Text>
      )}
    </>
  );
};

export { UpdateSummary };
