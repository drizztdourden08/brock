/* @layer electron-main @kind constants */
const NO_FACTORY = 'ctx.services is not set: pass services: (ctx) => AppServices to bootstrapApp';
const NOT_BUILT = 'ctx.services was read before the services were built; they are built at the start of the modules boot task';

export { NO_FACTORY, NOT_BUILT };
