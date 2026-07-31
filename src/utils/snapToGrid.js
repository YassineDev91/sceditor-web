export function snapValue(value, gridSize) {
  return Math.round(value / gridSize) * gridSize + 0;
}
