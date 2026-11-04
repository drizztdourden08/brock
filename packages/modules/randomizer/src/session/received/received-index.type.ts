/* @layer core @kind types */
interface ReceivedIndex {
  read(): number;
  write(index: number): void;
}

export type { ReceivedIndex };
