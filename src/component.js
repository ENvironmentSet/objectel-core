import { once } from './utils';
import merge from 'callbag-merge';
import pipe from 'callbag-pipe';
import map from 'callbag-map'

export default function component(propsToModel, modelToResult, eventMap = {}) {
  return props => event$ => {
    const eventHandler = (start, sink) => {
      if (start !== 0) return;

      event$(0, (t, d) => {
        if (t === 1) {
          const handler = eventMap[d.type];

          if (typeof handler === 'function') {
            prevModel = handler(d.payload, props, prevModel);
            sink(1, prevModel);
          }
        } else sink(t, d);
      });
    };
    const initModel = propsToModel(props);
    let prevModel = initModel;

    return pipe(
      merge(eventHandler, once(initModel)),
      map(model => modelToResult(model, props)),
    );
  };
};