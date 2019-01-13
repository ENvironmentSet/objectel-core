export default function once(data) {
  return (start, sink) => {
    if (start !== 0) return;

    sink(0, () => {});
    sink(1, data);
    sink(2);
  }
};