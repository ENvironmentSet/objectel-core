export default function ofType(type) {
  return event$ => (start, sink) => {
    if (start !== 0) return;

    event$(0, (t, d) => {
      if (t === 1) {
        if (d.type === type) sink(1, d);
      } else sink(t, d);
    });
  };
};