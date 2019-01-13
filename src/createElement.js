import { voidSource, once } from './utils';
import pipe from 'callbag-pipe';

function createStructuralElement(type, props, children) {
  return once({
    type,
    props: { ...props, children },
  });
}

export default function createElement(
  component,
  props,
  children,
  event$ = props && props.event$ || voidSource
) {
  if (typeof component !== 'function') return createStructuralElement(component, props, children);
  if (props === null) props = {};
  props.event$ = event$;
  props.children = children;
  return pipe(
    event$,
    component(props),
  );
}