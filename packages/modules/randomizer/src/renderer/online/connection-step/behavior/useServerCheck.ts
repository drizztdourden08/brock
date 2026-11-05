/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { probeServer, serverAddressError } from '../../../../archipelago';
import type { ProbeConfig } from '../../../../archipelago';
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { CONNECTION_TEXT } from '../ServerFields/ServerFields.constants';
import { connectionAddress } from '../connection-address';
import type { ConnectionForm } from '../connection-form.type';
import type { ServerCheck, ServerCheckPhase } from '../server-check.type';

const useServerCheck = (form: ConnectionForm): ServerCheck => {
  const archipelago = useRandomizerGame()?.archipelago;
  const [phase, setPhase] = useState<ServerCheckPhase>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const check = useCallback(() => {
    const problem = serverAddressError({ host: form.host, port: form.port });
    if (problem !== null) {
      setMessage(problem);
      return;
    }
    const config: ProbeConfig = { url: connectionAddress(form) };
    if (archipelago) config.game = archipelago.name;
    const make = archipelago?.createSocket?.bind(archipelago);
    if (make) config.createSocket = make;
    setPhase('checking');
    void probeServer(config).then((result) => {
      setMessage(result.ok ? CONNECTION_TEXT.reachable : result.reason);
      setPhase('done');
    });
  }, [form, archipelago]);
  return { phase, message, check };
};

export { useServerCheck };
