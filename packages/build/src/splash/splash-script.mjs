/* @layer tooling-scripts @kind config */

const SPLASH_SCRIPT = `(() => {
  const byId = (id) => document.getElementById(id);
  const status = byId('splash-status');
  const failure = byId('splash-failure');
  const message = byId('splash-message');
  const bar = byId('splash-bar');
  const version = new URLSearchParams(window.location.search).get('v');
  byId('splash-version').textContent = version ? 'v' + version : '';
  const bridge = window.brockSplash;
  if (!bridge) return;
  bridge.onProgress((view) => {
    status.classList.remove('ts-status--danger');
    bar.classList.remove('ts-progress--danger');
    failure.hidden = true;
    const line = [view.label, view.detail].filter(Boolean).join(' \\u00b7 ');
    if (line) status.textContent = line;
    bar.style.setProperty('--value', String(view.fraction));
    bar.setAttribute('aria-valuenow', String(Math.round(view.fraction * 100)));
  });
  bridge.onFailure((view) => {
    status.classList.add('ts-status--danger');
    bar.classList.add('ts-progress--danger');
    status.textContent = view.timedOut ? view.label + ' took too long' : view.label + ' failed';
    message.textContent = view.message;
    failure.hidden = false;
    byId('splash-retry').focus();
  });
  byId('splash-retry').addEventListener('click', () => bridge.retry());
  byId('splash-logs').addEventListener('click', () => bridge.openLogs());
  byId('splash-quit').addEventListener('click', () => bridge.quit());
})();`;

export { SPLASH_SCRIPT };
