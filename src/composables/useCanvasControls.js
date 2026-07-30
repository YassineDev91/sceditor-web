// src/composables/useCanvasControls.js
import { onMounted, ref, watch } from 'vue';
import { useContractStorage } from '@/stores/contract';
import { useSettingsStore } from '@/stores/settings';
import { useUIStore } from '@/stores/uiStore';

export function useCanvasControls(stageRef, mainLayer, widthCanvaRef, heightCanvaRef) {
  const fileStore = useContractStorage();
  const settingsStore = useSettingsStore();
  const ui = useUIStore();

  const zoomLevel = ref(1);
  const gridVisible = ref(settingsStore.editor.gridEnabled);
  const snapToGridEnabled = ref(settingsStore.editor.snapToGrid);
  const isPanMode = ref(false);

  const handleZoomIn = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = oldScale * 1.2;

    const center = {
      x: widthCanvaRef.value / 2,
      y: heightCanvaRef.value / 2
    };

    const mousePointTo = {
      x: (center.x - stage.x()) / oldScale,
      y: (center.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
    zoomLevel.value = newScale;

    if (Math.abs(newScale - oldScale) > 0.1) {
      fileStore.saveHistory();
    }
  };

  const handleZoomOut = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = Math.max(0.1, oldScale / 1.2); // Don't zoom out too much

    const center = {
      x: widthCanvaRef.value / 2,
      y: heightCanvaRef.value / 2
    };

    const mousePointTo = {
      x: (center.x - stage.x()) / oldScale,
      y: (center.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
    zoomLevel.value = newScale;

    if (Math.abs(newScale - oldScale) > 0.1) {
      fileStore.saveHistory();
    }
  };

  const handleZoomReset = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
    zoomLevel.value = 1;

    fileStore.saveHistory();
  };

  const fitToScreen = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const layer = mainLayer.value?.getNode();
    if (!layer) return;

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

    if (allElements.length === 0) {
      handleZoomReset();
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    allElements.forEach(el => {
      if (el.x !== undefined && el.y !== undefined) {
        minX = Math.min(minX, el.x);
        minY = Math.min(minY, el.y);
        maxX = Math.max(maxX, el.x + 200); // Approximate element width
        maxY = Math.max(maxY, el.y + 100); // Approximate element height
      }
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const padding = 50;
    const scaleX = (widthCanvaRef.value - padding * 2) / contentWidth;
    const scaleY = (heightCanvaRef.value - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

    const offsetX = (widthCanvaRef.value - contentWidth * scale) / 2 - minX * scale;
    const offsetY = (heightCanvaRef.value - contentHeight * scale) / 2 - minY * scale;

    stage.scale({ x: scale, y: scale });
    stage.position({ x: offsetX, y: offsetY });
    stage.batchDraw();
    zoomLevel.value = scale;

    fileStore.saveHistory();
  };

  const toggleGrid = () => {
    gridVisible.value = !gridVisible.value;
    settingsStore.updateEditorPreferences({ gridEnabled: gridVisible.value });
  };

  const toggleSnapToGrid = () => {
    snapToGridEnabled.value = !snapToGridEnabled.value;
    settingsStore.updateEditorPreferences({ snapToGrid: snapToGridEnabled.value });
  };

  const togglePanMode = () => {
    isPanMode.value = !isPanMode.value;
    const stage = stageRef.value?.getNode();
    if (stage) {
      stage.draggable(isPanMode.value);
    }
  };

  const handleUndo = () => {
    fileStore.undo();
  };

  const handleRedo = () => {
    fileStore.redo();
  };

  const attachWheelZoom = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    stage.on("wheel", (e) => {
      e.evt.preventDefault();

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      const scaleBy = 1.05;
      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();
    });
  };

  onMounted(() => {
    attachWheelZoom();
  });

  watch(() => ui.stageScale, (newScale) => {
    const stage = stageRef.value?.getNode();
    if (stage) {
      stage.scale({ x: newScale, y: newScale });
      stage.batchDraw();
      console.log("✅ Stage zoom updated to:", newScale);
    }
  });

  return {
    zoomLevel, gridVisible, snapToGridEnabled, isPanMode,
    handleZoomIn, handleZoomOut, handleZoomReset, fitToScreen,
    toggleGrid, toggleSnapToGrid, togglePanMode,
    handleUndo, handleRedo, attachWheelZoom,
  };
}
