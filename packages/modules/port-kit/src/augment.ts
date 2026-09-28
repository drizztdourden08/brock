/* @layer core @kind types */
import type { PortKitApi } from './port-kit.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'port-kit:readCore': (file: string) => Promise<ArrayBuffer | null>;
  }

  interface IpcNamespaces {
    portKit: PortKitApi;
  }
}
