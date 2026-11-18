/* @layer renderer-shell @kind logic */
const capitalise = (name: string, tag: string): string => name.charAt(0).toLocaleUpperCase(tag) + name.slice(1);

const languageName = (tag: string, inTag: string): string => {
  try {
    const name = new Intl.DisplayNames([inTag], { type: 'language' }).of(tag);
    return name ? capitalise(name, inTag) : tag;
  } catch {
    return tag;
  }
};

export { languageName };
