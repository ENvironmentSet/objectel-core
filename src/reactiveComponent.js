import { compose } from './utils';

export default function reactiveComponent(intent$, model$, result$) {
  const component = compose(result$, model$, intent$);

  return () => component;
}