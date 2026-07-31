// Store-agnostic group-drag tracking, shared by the SCD and FD drag
// composables. It only tracks per-element offsets and reports/repositions
// by element reference — how a caller actually persists the result to its
// own store is entirely up to that caller (SCD and FD persist differently).
export function useGroupDrag() {
  // Array<{ element, dx, dy }> — every OTHER selected element's offset from
  // the dragged element, captured once at dragstart. Null when no group
  // drag is in progress.
  let offsets = null;

  function startGroupDrag(draggedElement, selectedElements) {
    offsets = selectedElements
      .filter(el => el !== draggedElement)
      .map(el => ({ element: el, dx: el.x - draggedElement.x, dy: el.y - draggedElement.y }));
  }

  function isGroupDragActive() {
    return !!offsets && offsets.length > 0;
  }

  // dragmove: reposition every OTHER selected element's live Konva node by
  // the same delta the dragged node has moved so far. Visual-only — nothing
  // is persisted here. `resolveNode(element)` must return that element's
  // live Konva node (or a falsy value, which is skipped).
  function applyLiveDelta(resolveNode, draggedX, draggedY) {
    if (!offsets) return;
    offsets.forEach(({ element, dx, dy }) => {
      const node = resolveNode(element);
      if (node) node.position({ x: draggedX + dx, y: draggedY + dy });
    });
  }

  // dragend: returns the final { element, x, y } for every OTHER selected
  // element (the dragged element itself is the caller's own concern), and
  // clears the active drag. The caller persists all of these plus the
  // dragged element as a single undo step.
  function finishGroupDrag(draggedX, draggedY) {
    if (!offsets) return [];
    const result = offsets.map(({ element, dx, dy }) => ({ element, x: draggedX + dx, y: draggedY + dy }));
    offsets = null;
    return result;
  }

  return { startGroupDrag, isGroupDragActive, applyLiveDelta, finishGroupDrag };
}
