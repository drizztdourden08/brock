/* @layer renderer-shell @kind component */
import { useMemo, useState } from 'react';
import { logRowsToText } from '@drizztdourden08/brock-react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { useRoomMessages } from '../../online/hooks/behavior/useRoomMessages';
import { useRandomizerLabels } from '../../hooks/behavior/useRandomizerLabels';
import { useRandomizerLog } from '../../hooks/behavior/useRandomizerLog';
import { activityKindsOf } from '../activity/activity-kinds-of';
import { useActivityRules } from '../activity/behavior/useActivityRules';
import { mergeRoomRows } from '../activity/merge-room-rows';
import { useRoomSay } from './behavior/useRoomSay';
import { LOG_COUNT_LABEL, LOG_EMPTY_LABEL, SAY_PLACEHOLDER } from './LogsView.constants';

const LogsView = () => {
  const entries = useRandomizerLog();
  const messages = useRoomMessages();
  const say = useRoomSay();
  const labels = useRandomizerLabels();
  const { rules, gameRules } = useActivityRules();
  const [search, setSearch] = useState('');
  const rows = useMemo(() => mergeRoomRows(entries, messages, rules), [entries, messages, rules]);
  const kinds = useMemo(() => activityKindsOf(gameRules, labels.kinds), [gameRules, labels.kinds]);

  return (
    <LogPanel
      rows={rows}
      kinds={kinds}
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
