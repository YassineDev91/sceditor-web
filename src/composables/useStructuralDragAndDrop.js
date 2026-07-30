// src/composables/useStructuralDragAndDrop.js
import { useContractStorage } from '@/stores/contract';

export function useStructuralDragAndDrop(stageRef, mainLayer) {
  const fileStore = useContractStorage();

  const handleScdDragMove = (e, cmp) => {
    const node = e.target;

    if (!node?.id) {
      console.warn("⚠️ SCD element missing data.id:", node);
      return;
    }

    const { x, y } = node.position();

    cmp.x = x;
    cmp.y = y;

    // Save history after drag
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

  return { handleDrop, handleScdDragMove };
}
