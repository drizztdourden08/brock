/* @layer electron-main @kind types */
import type { MainBugReportTransport, MainContext } from '@drizztdourden08/brock-electron/main';
import type { RecordingSentRef } from '../../recording.type';

type RecordingPaths = Pick<MainContext, 'paths'>;

type SentSelector = (payload: Parameters<MainBugReportTransport>[0]) => RecordingSentRef | null;

interface SentTaggingOptions {
  select?: SentSelector;
  now?: () => number;
}

export type { RecordingPaths, SentSelector, SentTaggingOptions };
