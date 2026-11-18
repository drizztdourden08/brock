/* @layer core @kind types */
type MessageValue = string | number | boolean | Date | readonly string[] | null | undefined;

type MessageValues = Readonly<Record<string, MessageValue>>;

export type { MessageValue, MessageValues };
