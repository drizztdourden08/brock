/* @layer core @kind types */
interface CheckReporter {
  reportCheck(locationId: number): void;
  reportGoal(): void;
  checkedLocations(): ReadonlySet<number>;
}

export type { CheckReporter };
