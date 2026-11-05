/* @layer core @kind test */
const LOCAL_ADDRESSES = [
  'localhost:38281', 'LOCALHOST:38281', 'room.localhost:38281', '127.0.0.1:38281', '127.5.5.5',
  '0.0.0.0:38281', '10.0.0.4:38281', '172.16.0.9:38281', '172.31.255.1:38281', '192.168.1.20:38281',
  '169.254.3.3:38281', '[::1]:38281', '::1', '[fd12:3456::1]:38281', '[fe80::1]:38281',
  'gaming-pc:38281', 'nas.local:38281',
];

const ONLINE_ADDRESSES = [
  'archipelago.gg:38281', '8.8.8.8:38281', '172.32.0.1:38281', '172.15.0.1:38281', '192.169.0.1:38281',
  '[2001:db8::1]:38281', 'my.server.net',
];

export { LOCAL_ADDRESSES, ONLINE_ADDRESSES };
