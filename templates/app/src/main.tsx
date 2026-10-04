/* @layer renderer-app @kind entry */
import '@drizztdourden08/tessera/tokens.css';
import './theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrockApp } from '@drizztdourden08/brock-react';
import { rendererModules } from '../.brock/modules.renderer';
import { rendererBootTasks } from '../.brock/boot.renderer';
import { screenTree } from '../.brock/screens';
import { appWidgets } from '../.brock/widgets';
import { appTitleBar } from '../.brock/title-bar';
import { SETTINGS } from './main.constants';
import { product } from './product';
import type { AppSettings } from './settings.type';

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

createRoot(root).render(
  <StrictMode>
    <BrockApp<AppSettings>
      product={product}
      settings={SETTINGS}
      screenTree={screenTree}
      modules={rendererModules}
      bootTasks={rendererBootTasks}
      widgets={appWidgets}
      titleBar={appTitleBar}
    />
  </StrictMode>,
);
