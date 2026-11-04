/* @layer renderer-shell @kind component */
import { useMemo, useState } from 'react';
import { logRowsToText } from '@drizztdourden08/brock-react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { useRoomMessages } from '../../online/hooks/behavior/useRoomMessages';
import { useRandomizerLog } from '../../hooks/behavior/useRandomizerLog';
import { mergeRoomRows } from './behavior/merge-room-rows';
import { useRoomSay } from './behavior/useRoomSay';
import { LOG_COUNT_LABEL, LOG_EMPTY_LABEL, LOG_KINDS, SAY_PLACEHOLDER } from './LogsView.constants';

const LogsView = () => {
  const entries = useRandomizerLog();
  const messages = useRoomMessages();
  const say = useRoomSay();
  const [search, setSearch] = useState('');
  const rows = useMemo(() => mergeRoomRows(entries, messages), [entries, messages]);

  return (
    <LogPanel
      rows={rows}
      kinds={LOG_KINDS}
      search={search}
      onSearchChange={setSearch}
      copyText={logRowsToText}
      countLabel={LOG_COUNT_LABEL}
      emptyLabel={LOG_EMPTY_LABEL}
      onInput={say ?? undefined}
      inputDisabled={say === null}
      inputPlaceholder={SAY_PLACEHOLDER}
    />
  );
};

export { LogsView };
