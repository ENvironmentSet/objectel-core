import { once } from './utils';

export default function createEventBus(...initEvents) {
  const listeners = [];
  const emitters = [];
  const Emit$ = event$ => {
    let emitterIndex;

    event$(0, (t, d) => {
      if (t === 0) emitterIndex = emitters.push(d);
      else if (t === 1) setImmediate(() => listeners.forEach(listener => listener(1, d)));
      else emitters.splice(emitters, 1);
    });
  };
  const Listen$ = (start, sink) => {
    if (start !== 0) return;
    const listenerIndex = listeners.push(sink);

    sink(0, end => {
      if (end === 2) listeners.splice(listenerIndex, 1);
    });
  };
  const destroy = error => {
    listeners.forEach(listener => listener(2, error));
    emitters.forEach(emitter => emitter(2, error));
  };
  initEvents.forEach(event => Emit$(once(event)));

  return {
    Emit$,
    Listen$,
    destroy,
  }
};