/* @layer core @kind types */
interface LanAddress {
  interfaceName: string;
  address: string;
  family: 'IPv4' | 'IPv6';
  cidr: string | null;
}

export type { LanAddress };
