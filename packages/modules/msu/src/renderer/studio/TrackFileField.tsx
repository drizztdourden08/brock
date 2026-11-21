/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { Field, Select } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import type { TrackFileFieldProps } from './TrackFileField.type';

const TrackFileField = (props: TrackFileFieldProps) => {
  const { trackNum, fileName, fileSize, options, busy, readOnly, onAssign } = props;
  const t = useT();

  return (
    <Field label={t('msu:ui.file')} hint={fileSize == null ? undefined : formatBytes(fileSize)}>
      <Select
        value={fileName ?? ''}
        options={options}
        placeholder={t('msu:ui.selectFile')}
        searchable
        disabled={busy || readOnly}
        onChange={(value) => onAssign(trackNum, value)}
      />
    </Field>
  );
};

export { TrackFileField };
