import { compose } from './utils';

function reactiveComponentWithFactory(componentFactory) {
  return componentFactory;
}

function reactiveComponentWithoutFactory(intent$, model$, result$) {
  const component = compose(result$, model$, intent$);

  return () => component;
}

export default function reactiveComponent(...args) {
  return args.length === 1 ?
    reactiveComponentWithFactory(...args)
    :
    reactiveComponentWithoutFactory(...args);
}