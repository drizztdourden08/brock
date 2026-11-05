/* @layer core @kind types */
import type { FakeCore } from './fake-core.type';

type FakeCoreDelivery = Pick<FakeCore, 'deliver' | 'cancelDeliveries' | 'grantNext' | 'becomeReady'>;

export type { FakeCoreDelivery };
