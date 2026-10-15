/* @layer tooling-scripts @kind logic */

/**
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

/**
 * @param {ProductInput} product
 * @returns {string | null} the project page, from product.repo
 */
const homepageOf = (product) => (product.repo ? `https://github.com/${product.repo.owner}/${product.repo.name}` : null);

/**
 * @param {ProductInput['author']} author
 * @returns {string} the .deb maintainer, `Name <email>`
 */
const maintainerOf = (author) => (author.email ? `${author.name} <${author.email}>` : author.name);

/**
 * @param {ProductInput} product
 * @returns {{ extraMetadata: Record<string, unknown>, linux: Record<string, string> }}
 */
const linuxMetadata = (product) => {
  const homepage = homepageOf(product);
  const author = product.author.email ? { name: product.author.name, email: product.author.email } : { name: product.author.name };
  return {
    extraMetadata: { author, ...(homepage ? { homepage } : {}) },
    linux: {
      maintainer: maintainerOf(product.author),
      vendor: product.author.name,
      ...(product.description ? { synopsis: product.description, description: product.description } : {}),
      ...(product.linuxCategory ? { category: product.linuxCategory } : {}),
    },
  };
};

export { linuxMetadata };
