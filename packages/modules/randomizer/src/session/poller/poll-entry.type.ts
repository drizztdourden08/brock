/* @layer core @kind types */
import type { FlagProbe } from '../../memory/flag-probe.type';

type PollEntry = { key: string; probe?: FlagProbe; checkId?: string; baselineOnly?: boolean };

export type { PollEntry };
