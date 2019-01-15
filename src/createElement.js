import { once } from './utils';

function createStructuralElement(type, props, children) {
  return () => once({
    type,
    props: { ...props, children },
  });
}

function createReactiveElement(component, props, children) {
  props.children = children;

  return component(props);
}

export default function createElement(
  component,
  props,
  ...children
) {
  if (props == null) props = {};
  if (children.length === 1) children = children[0];

  return typeof component !== 'function' ?
    createStructuralElement(component, props, children)
    :
    createReactiveElement(component, props, children);
}