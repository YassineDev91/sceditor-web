import { nextTick, ref, watch } from 'vue';
import { useContractStorage } from '@/stores/contract';

export function getIntersectingElements(elements, box) {
  const elemWidth = 160;
  const elemHeight = 100;
  return elements.filter(element => {
    if (element.x === undefined || element.y === undefined) return false;
    const intersects = !(
      element.x > box.x + box.width ||
      element.x + elemWidth < box.x ||
      element.y > box.y + box.height ||
      element.y + elemHeight < box.y
    );
    console.log(`🔍 Element "${element.name}" at (${element.x}, ${element.y}): ${intersects ? '✅ SELECTED' : '❌ not selected'}`);
    return intersects;
  });
}

export function useSelectionBox(stageRef, mainLayer) {
  const fileStore = useContractStorage();

  const selectionBox = ref({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    startX: 0,
    startY: 0
  });

  const justDragged = ref(false);

  const isElementSelected = (element) => {
    const selected = fileStore.selectedElements.includes(element);
    if (selected) {
      console.log(`✨ isElementSelected(${element.name}): ${selected}`);
    }
    return selected;
  };

  const selectElementsInBox = () => {
    if (selectionBox.value.width < 5 && selectionBox.value.height < 5) {
      fileStore.clearSelection();
      return;
    }

    const box = selectionBox.value;
    console.log("📦 Selection box:", {
      x: box.x.toFixed(2),
      y: box.y.toFixed(2),
      width: box.width.toFixed(2),
      height: box.height.toFixed(2)
    });

    const allElements = [
      ...fileStore.contract.variables || [],
      ...fileStore.contract.structs || [],
      ...fileStore.contract.functions || [],
      ...fileStore.contract.enums || [],
      ...fileStore.contract.guards || [],
      ...fileStore.contract.errorDeclarations || [],
      ...fileStore.contract.events || [],
    ];

    if (fileStore.contract._constructor) {
      allElements.push(fileStore.contract._constructor);
    }

    fileStore.clearSelection();

    const matched = getIntersectingElements(allElements, box);
    matched.forEach(element => fileStore.addToSelection(element));

    console.log(`✅ Selected ${fileStore.selectedElements.length} element(s)`);
  };

  const handleMouseDown = (e) => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const target = e.target;
    console.log("🖱️ MouseDown on:", target.getType?.(), target.attrs?.name || target.parent?.attrs?.name);

    const isTargetDraggable = target.draggable && target.draggable();
    const isParentDraggable = target.parent && target.parent.draggable && target.parent.draggable();

    if (isTargetDraggable || isParentDraggable) {
      return;
    }

    const pos = stage.getPointerPosition();
    const scale = stage.scaleX();

    selectionBox.value.visible = true;
    selectionBox.value.startX = (pos.x - stage.x()) / scale;
    selectionBox.value.startY = (pos.y - stage.y()) / scale;
    selectionBox.value.x = selectionBox.value.startX;
    selectionBox.value.y = selectionBox.value.startY;
    selectionBox.value.width = 0;
    selectionBox.value.height = 0;

    console.log("📍 Selection start:", { startX: selectionBox.value.startX, startY: selectionBox.value.startY });
  };

  const handleMouseMove = (e) => {
    if (!selectionBox.value.visible) return;

    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    const scale = stage.scaleX();

    const currentX = (pos.x - stage.x()) / scale;
    const currentY = (pos.y - stage.y()) / scale;

    const x = Math.min(selectionBox.value.startX, currentX);
    const y = Math.min(selectionBox.value.startY, currentY);
    const width = Math.abs(currentX - selectionBox.value.startX);
    const height = Math.abs(currentY - selectionBox.value.startY);

    selectionBox.value.x = x;
    selectionBox.value.y = y;
    selectionBox.value.width = width;
    selectionBox.value.height = height;
  };

  const handleMouseUp = () => {
    console.log("⬆️ MouseUp - selectionBox.visible:", selectionBox.value.visible);
    if (!selectionBox.value.visible) return;

    const wasDrag = selectionBox.value.width > 5 || selectionBox.value.height > 5;

    if (wasDrag) {
      selectElementsInBox();

      justDragged.value = true;
      setTimeout(() => {
        justDragged.value = false;
      }, 100);
    }

    selectionBox.value.visible = false;
    console.log("🔲 Selection box hidden");
  };

  const handleContractClick = () => {
    if (!justDragged.value) {
      console.log("📋 Contract clicked - clearing selection");
      fileStore.clearSelection();
    } else {
      console.log("🚫 Contract clicked but drag just happened - keeping selection");
    }
  };

  watch(
    () => fileStore.selectedElements,
    () => {
      nextTick(() => {
        const stage = stageRef.value?.getNode();
        const layer = mainLayer.value?.getNode();
        if (stage) {
          if (layer) {
            layer.batchDraw();
          }
          stage.batchDraw();
          console.log("🔄 Forced redraw after selection change");
        }
      });
    },
    { deep: true }
  );

  return {
    selectionBox,
    isElementSelected,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContractClick,
  };
}
