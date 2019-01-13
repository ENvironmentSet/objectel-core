export default function voidSource(start, sink) {
  if (start !== 0) return;

  sink(0, () => {});
}