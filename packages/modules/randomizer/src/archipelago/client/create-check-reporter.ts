/* @layer core @kind logic */
import type { ClientKit } from './client-kit.type';

interface CheckReporter {
  reportCheck(locationId: number): void;
  reportGoal(): void;
  checkedLocations(): ReadonlySet<number>;
}

const createCheckReporter = (kit: ClientKit): CheckReporter => ({
  reportCheck(locationId) {
    const { room, state } = kit;
    if (room.reportedLocal.has(locationId)) return;
    room.reportedLocal.add(locationId);
    kit.emit({ type: 'location-checked', locationId });
    if (state.connection === null || !room.connected || room.checked.has(locationId)) return;
    kit.send({ cmd: 'LocationChecks', locations: [locationId] });
  },
  reportGoal: () => kit.goal.report(),
  checkedLocations: () => kit.room.checked,
});

export { createCheckReporter };
export type { CheckReporter };
