/* @layer core @kind types */
import type { ArchipelagoClient } from './archipelago-client.type';
import type { ClientEvent } from './client-event.type';

interface ArchipelagoSession extends ArchipelagoClient {
  reportCheck(locationId: number): void;
  reportGoal(): void;
  checkedLocations(): ReadonlySet<number>;
  onEvent(f: (event: ClientEvent) => void): () => void;
}

export type { ArchipelagoSession };
