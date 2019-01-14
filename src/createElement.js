import { once } from './utils';

function createStructuralElement(type, props, children) {
  return () => once({
    type,
    props: { ...props, children },
  });
}

function createReactiveElement(component, props, children) {
  const componentFactory = component(props);
  if (props === null) props = {};
  props.children = children;

  return componentFactory;
}

export default function createElement(
  component,
  props,
  ...children
) {
  return typeof component !== 'function' ?
    createStructuralElement(component, props, children)
    :
    createReactiveElement(component, props, children);
}