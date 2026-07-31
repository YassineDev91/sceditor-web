// src/composables/useStructuralDragAndDrop.js
import { useContractStorage } from '@/stores/contract';
import { useSettingsStore } from '@/stores/settings';
import { snapValue } from '@/utils/snapToGrid';

const FD_STEP_KINDS = ['Action', 'Call', 'Emit', 'Decision', 'Return', 'Revert'];

export function useStructuralDragAndDrop(stageRef, mainLayer, groupDrag, snapToGridEnabled) {
  const fileStore = useContractStorage();
  const settingsStore = useSettingsStore();

  const resolveScdNode = (element) => {
    const layer = mainLayer.value?.getNode();
    if (!layer) return null;
    return layer.getChildren().find(n => n.attrs.data === element);
  };

  // dragstart: only begins a group move when the dragged element is part of
  // an active multi-selection — dragging a lone element never touches
  // useGroupDrag at all.
  const handleScdDragStart = (e, cmp) => {
    if (fileStore.selectedElements.length > 1 && fileStore.selectedElements.includes(cmp)) {
      groupDrag.startGroupDrag(cmp, fileStore.selectedElements);
    }
  };

  // dragmove: continuous, visual-only. Snaps the dragged node to the grid
  // (if enabled) and, if this is a group move, repositions every other
  // selected element's live Konva node by the same delta. Nothing is
  // persisted here — persistence happens once, on dragend.
  const handleScdDragMoveLive = (e, cmp) => {
    const node = e.target;
    let { x, y } = node.position();

    if (snapToGridEnabled.value) {
      x = snapValue(x, settingsStore.editor.gridSize);
      y = snapValue(y, settingsStore.editor.gridSize);
      node.position({ x, y });
    }

    if (groupDrag.isGroupDragActive()) {
      groupDrag.applyLiveDelta(resolveScdNode, x, y);
    }
  };

  const handleScdDragMove = (e, cmp) => {
    const node = e.target;

    if (!node?.id) {
      console.warn("⚠️ SCD element missing data.id:", node);
      return;
    }

    const { x, y } = node.position();

    cmp.x = x;
    cmp.y = y;

    if (groupDrag.isGroupDragActive()) {
      const others = groupDrag.finishGroupDrag(x, y);
      others.forEach(({ element, x: ox, y: oy }) => {
        element.x = ox;
        element.y = oy;
      });
    }

    // Save history once for the whole move (dragged element plus any group).
    fileStore.saveHistory();
  };

  const handleDrop = (event) => {
    console.log("📦 Drop event fired");

    const raw = event.dataTransfer.getData("application/json");
    if (!raw) {
      console.warn("❌ No dataTransfer payload found");
      return;
    }

    const item = JSON.parse(raw);
    console.log("🎯 Dropped item:", item);

    const stage = stageRef.value.getNode();
    const rect = stageRef.value.$el.getBoundingClientRect();
    const pointerPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    console.log("🧭 Pointer position:", pointerPosition);

    if (FD_STEP_KINDS.includes(item.label)) {
      if (!fileStore.selectedFunction?.id) {
        console.warn("⚠️ No function/guard open — can't drop a step");
        return;
      }
      fileStore.createBodyStep(fileStore.selectedFunction, item.label, `new_${item.label.toLowerCase()}`, pointerPosition);
      return;
    }

    const layer = mainLayer.value.getNode();
    const nodes = layer.getChildren();

    const structNode = nodes.find((node) => {
      const rect = node.getClientRect();
      return (
        (node.attrs.type === 'Struct') &&
        pointerPosition.x >= rect.x &&
        pointerPosition.x <= rect.x + rect.width &&
        pointerPosition.y >= rect.y &&
        pointerPosition.y <= rect.y + rect.height
      );
    });

    if (structNode) {
      const structName = structNode.attrs.name;
      const struct = fileStore.contract.structs.find(s => s.name === structName);
      if (struct && item.label === "Literal") {
        if (!struct.literals) {
          struct.literals = [];
        }
        struct.literals.push({
          name: "new_literal",
          type: { kind: "primitive", name: "string" },
          visibility: "public"
        });
        console.log(`✅ Added literal to struct ${structName}`);
      }
    } else {
      if (item.label == "Struct") {
        fileStore.createStructElement(pointerPosition);
      }
      if (item.label == "Variable") {
        fileStore.createVariableElement(pointerPosition);
      }
      if (item.label == "Function") {
        fileStore.createFunctionElement(pointerPosition);
      } if (item.label == "Assignment") {
        console.log("creating assignment stmt!");
      }
    }
  };

  return { handleDrop, handleScdDragMove, handleScdDragStart, handleScdDragMoveLive };
}
