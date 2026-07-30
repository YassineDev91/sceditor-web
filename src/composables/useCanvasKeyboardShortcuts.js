// src/composables/useCanvasKeyboardShortcuts.js
import { onMounted, onUnmounted } from 'vue';
import { useContractStorage } from '@/stores/contract';

export function useCanvasKeyboardShortcuts(controls, isMainLayerVisible) {
  const fileStore = useContractStorage();
  const { handleZoomIn, handleZoomOut, handleZoomReset, fitToScreen, handleUndo, handleRedo, togglePanMode } = controls;

  // CTRL+A / CMD+A to select all
  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault(); // Prevent browser's default select all
      if (isMainLayerVisible.value) {
        fileStore.selectAll();
      }
    }
  };

  // Delete key removes the current selection
  const handleListKeyPress = (event) => {
    if (event.key === 'Delete') {
      fileStore.deleteElement();
    }
  };

  // Zoom / undo-redo / pan shortcuts
  const handleCanvasKeyboard = (event) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === '=' || event.key === '+') {
        event.preventDefault();
        handleZoomIn();
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        handleZoomOut();
      } else if (event.key === '0') {
        event.preventDefault();
        handleZoomReset();
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        fitToScreen();
      } else if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if (event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        handleRedo();
      } else if (event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    }

    if (event.key === ' ' && !event.repeat) {
      event.preventDefault();
      togglePanMode();
    }
  };

  onMounted(() => {
    window.addEventListener('keyup', handleListKeyPress);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleCanvasKeyboard);
  });

  onUnmounted(() => {
    window.removeEventListener('keyup', handleListKeyPress);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keydown', handleCanvasKeyboard);
  });
}
