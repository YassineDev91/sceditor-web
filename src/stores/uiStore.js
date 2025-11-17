import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
    const stageScale = ref(1);
    const setScale = (scale) => {
        stageScale.value = scale;
    };

    // Autosave state
    const lastSavedTime = ref(null);
    const isSaving = ref(false);

    const setLastSavedTime = (time) => {
        lastSavedTime.value = time;
    };

    const setSaving = (saving) => {
        isSaving.value = saving;
    };

    return { stageScale, setScale, lastSavedTime, isSaving, setLastSavedTime, setSaving };
});