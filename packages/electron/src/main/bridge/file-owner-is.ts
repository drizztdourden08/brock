/* @layer electron-main @kind logic */
const escaped = (text: string): string => text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const fileOwnerIs = (listing: string, owner: string, name: string): boolean => {
  if (!owner.includes('\\')) return false;
  const line = new RegExp(String.raw`\s${escaped(owner)}\s+${escaped(name)}\s*$`, 'i');
  return listing.split(/\r?\n/).some((text) => line.test(text));
};

export { fileOwnerIs };
