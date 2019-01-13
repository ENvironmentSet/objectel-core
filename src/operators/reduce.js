export default function reduce(reducer, preloadedModel) {
  return source$ => (start, sink) => {
    let prevModel = preloadedModel;

    source$(0, (t, d) => {
      if (t === 1) {
        prevModel = reducer(prevModel, d);
        sink(1, prevModel);
      } else sink(t, d);
    });
    sink(1, preloadedModel);
  };
};