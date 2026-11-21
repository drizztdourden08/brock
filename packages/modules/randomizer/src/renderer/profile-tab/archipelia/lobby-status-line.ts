/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { ArchipeliaMembership } from '../../archipelia/membership/membership.type';
import type { LobbyLive } from '../../archipelia/store/lobby-status-store.type';
import type { LobbyStatusLine } from './lobby-status-line.type';

type Resolve = (value: Text) => string;

const progressLine = (live: LobbyLive | undefined, text: Resolve): LobbyStatusLine | null => {
  const progress = live?.progress;
  if (progress === null || progress === undefined) return null;
  const line = text(msg(progress.phase === 'generating' ? 'randomizer:lobby.status.generating' : 'randomizer:lobby.status.starting'));
  return { text: line, tone: 'neutral', busy: false, progress: progress.fraction, final: false };
};

const goneText = (m: ArchipeliaMembership, text: Resolve): string =>
  (m.state.kind === 'gone' && m.state.reason === 'unsupported'
    ? text(msg('randomizer:lobby.status.unsupported', { ap: m.ap }))
    : text(msg('randomizer:lobby.status.gone')));

const lobbyStatusLine = (m: ArchipeliaMembership, live: LobbyLive | undefined, text: Resolve): LobbyStatusLine => {
  const { state } = m;
  if (state.kind === 'approved') {
    return progressLine(live, text) ?? { text: text(msg('randomizer:lobby.status.approved')), tone: 'success', busy: true, final: false };
  }
  if (state.kind === 'failed') return { text: text(msg('randomizer:lobby.status.failed')), tone: 'warning', busy: false, final: false };
  if (state.kind === 'refused') {
    return { text: text(msg('randomizer:lobby.status.refused')), why: state.reason, tone: 'danger', busy: false, final: true };
  }
  if (state.kind === 'gone') return { text: goneText(m, text), tone: 'danger', busy: false, final: true };
  if (state.kind === 'started') return { text: text(msg('randomizer:lobby.status.started')), tone: 'success', busy: false, final: false };
  return { text: text(msg('randomizer:lobby.status.pending')), tone: 'neutral', busy: true, final: false };
};

export { lobbyStatusLine };
