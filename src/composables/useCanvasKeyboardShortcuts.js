// src/composables/useCanvasKeyboardShortcuts.js
import { onMounted, onUnmounted } from 'vue';
import { useContractStorage } from '@/stores/contract';

// Text fields (the properties panel's inputs/textareas, any contenteditable)
// must keep normal typing behavior — none of the single-key shortcuts below
// (Space, Delete, Ctrl/Cmd+A) should fire while the user is typing in one.
const EDITABLE_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];
function isEditableTarget(event) {
  const target = event.target;
  if (!target) return false;
  if (EDITABLE_TAGS.includes(target.tagName)) return true;
  return !!target.isContentEditable;
}

export function useCanvasKeyboardShortcuts(controls, isMainLayerVisible) {
  const fileStore = useContractStorage();
  const {
    handleZoomIn, handleZoomOut, handleZoomReset, fitToScreen,
    handleUndo, handleRedo, togglePanMode, isPanMode,
  } = controls;

  // Space is a momentary hold, matching every reference canvas tool
  // (Photoshop/Illustrator/Figma/Blender): pan mode activates while held and
  // reverts automatically on release. If pan mode was already on from the
  // toolbar's persistent toggle before Space was pressed, Space is a no-op —
  // it must not turn off a pan mode the user deliberately locked in.
  let spaceActivatedPan = false;

  // CTRL+A / CMD+A to select all
  const handleKeyDown = (event) => {
    if (isEditableTarget(event)) return;
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault(); // Prevent browser's default select all
      if (isMainLayerVisible.value) {
        fileStore.selectAll();
      }
    }
  };

  // Delete key removes the current selection
  const handleListKeyPress = (event) => {
    if (isEditableTarget(event)) return;
    if (event.key === 'Delete') {
      fileStore.deleteElement();
    }
  };

  // Zoom / undo-redo / pan shortcuts
  const handleCanvasKeyboard = (event) => {
    if (isEditableTarget(event)) return;

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
      if (!isPanMode.value) {
        togglePanMode();
        spaceActivatedPan = true;
      }
    }
  };

  const handleCanvasKeyUp = (event) => {
    if (event.key === ' ' && spaceActivatedPan) {
      spaceActivatedPan = false;
      togglePanMode();
    }
  };

  onMounted(() => {
    window.addEventListener('keyup', handleListKeyPress);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleCanvasKeyboard);
    window.addEventListener('keyup', handleCanvasKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener('keyup', handleListKeyPress);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keydown', handleCanvasKeyboard);
    window.removeEventListener('keyup', handleCanvasKeyUp);
  });
}
