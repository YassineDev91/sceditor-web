import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
    const stageScale = ref(1);
    const setScale = (scale) => {
        stageScale.value = scale;
    };


    return { stageScale, setScale };
});