/* @layer electron-main @kind logic */
const vetNetUrl = (raw: string, hosts: readonly string[]): URL => {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('net.read needs a full web address');
  }
  if (url.protocol !== 'https:') throw new Error(`net.read only fetches https addresses, not "${url.protocol}"`);
  if (url.username !== '' || url.password !== '') throw new Error('net.read does not take a user name or password in the address');
  if (url.port !== '') throw new Error('net.read only uses the standard https port');
  if (!hosts.includes(url.hostname)) throw new Error(`net.read is not allowed to reach "${url.hostname}": the product does not list it`);
  return url;
};

export { vetNetUrl };
