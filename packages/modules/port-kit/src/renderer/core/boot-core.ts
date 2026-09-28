/* @layer renderer-shell @kind logic */
import type { PortDefinition, VideoDefinition } from '../../port/port-definition.type';
import type { EmscriptenModule } from './emscripten.type';
import type { CoreBoot } from './game-core.type';
import { createInstantiateWasm } from './create-instantiate-wasm';
import { loadCoreBytes } from './load-core-bytes';
import { loadGlueScript } from './load-glue-script';
import { writeBootFiles } from './write-boot-files';

const emscriptenCanvas = (video: VideoDefinition, canvas: HTMLCanvasElement | null | undefined): HTMLCanvasElement | undefined => {
  if (!canvas || video.mode !== 'emscripten') return undefined;
  if (video.context === '2d') canvas.getContext('2d');
  else canvas.getContext(video.context, { preserveDrawingBuffer: true });
  return canvas;
};

const bootCore = async (definition: PortDefinition, boot: CoreBoot, headless: boolean): Promise<EmscriptenModule> => {
  const { core, video } = definition;
  const factory = await loadGlueScript(core.glue, core.factory);
  const bytes = await loadCoreBytes(core.wasm);
  const log = boot.log ?? (() => undefined);
  let fail: (error: unknown) => void = () => undefined;
  const failed = new Promise<never>((_resolve, reject) => {
    fail = reject;
  });
  const booting = factory({
    canvas: headless ? undefined : emscriptenCanvas(video, boot.canvas),
    noInitialRun: headless,
    instantiateWasm: createInstantiateWasm(bytes, (error) => fail(error)),
    preRun: [(mod) => writeBootFiles(mod.FS, core.files, boot)],
    print: (text) => log(text, 'info'),
    printErr: (text) => log(text, 'error'),
  });
  return Promise.race([booting, failed]);
};

export { bootCore };
