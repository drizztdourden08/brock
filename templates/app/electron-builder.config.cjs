/* @layer root-config @kind config */
module.exports = async () => {
  const { loadBuilderConfig } = await import('@drizztdourden08/brock-build/builder');
  return loadBuilderConfig(__dirname);
};
