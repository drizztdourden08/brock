/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { UpdateSummaryProps } from '../UpdateDialog.type';

const UpdateSummary = (props: UpdateSummaryProps) => {
  const { status, info, currentVersion, capabilities } = props;

  if (!capabilities.canCheck) {
    return <Text as="p" className="update-dialog__status">This build does not check for updates.</Text>;
  }
  if (status === 'checking') {
    return <Text as="p" className="update-dialog__status">Checking for a newer version.</Text>;
  }

  return (
    <>
      <Text as="p" className="update-dialog__version">
        {info ? `Version ${info.version} is available.` : `Version ${currentVersion} is the latest.`}
      </Text>
      {!capabilities.canInstall && info && (
        <Text as="p" className="update-dialog__status">
          This build cannot update itself. The release page has the download.
        </Text>
      )}
    </>
  );
};

export { UpdateSummary };
