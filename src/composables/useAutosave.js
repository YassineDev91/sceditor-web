// src/composables/useAutosave.js
import { watch } from 'vue';
import { useContractStorage } from '@/stores/contract';
import { useProjectsStore } from '@/stores/projects';
import { useUIStore } from '@/stores/uiStore';

export function useAutosave() {
  const fileStore = useContractStorage();
  const projectsStore = useProjectsStore();
  const ui = useUIStore();

  let saveTimeout = null;

  const saveContract = async () => {
    try {
      ui.setSaving(true);
      await projectsStore.saveActiveProject();
      const now = Date.now();
      ui.setLastSavedTime(now);
      console.log("💾 Contract autosaved");
      setTimeout(() => ui.setSaving(false), 500); // Show saving indicator briefly
    } catch (error) {
      console.error("❌ Failed to save contract:", error);
      ui.setSaving(false);
    }
  };

  // Watch diagram state to save it (deep watch with debouncing)
  watch(
    () => fileStore.contract,
    () => {
      // Debounce saves to avoid excessive writes
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveContract, 1000); // Save 1 second after last change
    },
    { deep: true }
  );

  return { saveContract };
}
