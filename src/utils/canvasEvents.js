// A Konva event's underlying native browser MouseEvent lives at `e.evt`.
export function isMultiSelectModifier(konvaEvent) {
  const native = konvaEvent?.evt;
  return !!(native && (native.shiftKey || native.ctrlKey || native.metaKey));
}
