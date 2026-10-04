/* @layer renderer-shell @kind logic */
import type { LeaveGuard, LeaveGuardRegistry } from './navigation.type';

const guards = new Set<LeaveGuard>();

const leaveGuards: LeaveGuardRegistry = {
  add: (guard) => {
    guards.add(guard);
    return () => { guards.delete(guard); };
  },
  dirty: () => [...guards].some((guard) => guard()),
};

export { leaveGuards };
