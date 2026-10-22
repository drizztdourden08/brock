/* @layer electron-main @kind logic */
import { app } from 'electron';
import { SOFTWARE_GL_SWITCH } from './headless-rendering.constants';

const applySoftwareRendering = (): void => {
  app.disableHardwareAcceleration();
  if (!app.commandLine.hasSwitch(SOFTWARE_GL_SWITCH)) app.commandLine.appendSwitch(SOFTWARE_GL_SWITCH);
};

export { applySoftwareRendering };
