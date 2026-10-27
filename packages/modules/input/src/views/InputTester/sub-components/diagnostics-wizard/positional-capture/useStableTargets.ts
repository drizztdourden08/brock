/* @layer renderer-shell @kind hook */
import { useRef } from 'react';
import type { ResolvedDevice } from '../../../../../family';
import { buildPositionalTargets } from './build-positional-targets';
import type { PositionalTarget } from './positional-capture.type';

const layoutKeyOf = (resolvedDevice: ResolvedDevice | null): string =>
  resolvedDevice ? resolvedDevice.controls.map((control) => `${control.kind}:${control.position}`).join('|') : '';

const useStableTargets = (resolvedDevice: ResolvedDevice | null): PositionalTarget[] => {
  const key = layoutKeyOf(resolvedDevice);
  const kept = useRef<{ key: string; targets: PositionalTarget[] } | null>(null);
  if (kept.current?.key !== key) kept.current = { key, targets: buildPositionalTargets(resolvedDevice) };
  return kept.current.targets;
};

export { useStableTargets };
