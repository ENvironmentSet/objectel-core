export default function compose(f, ...fs) {
  return fs.length ?
    (...args) => f(compose(...fs)(...args))
    :
    f;
}