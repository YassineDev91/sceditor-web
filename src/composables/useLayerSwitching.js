// src/composables/useLayerSwitching.js
import { ref } from 'vue';
import { useContractStorage } from '@/stores/contract';

export function useLayerSwitching({ onToggle } = {}) {
  const fileStore = useContractStorage();

  const isMainLayerVisible = ref(true);
  const isFunctionLayerVisible = ref(!isMainLayerVisible.value);
  const selectedFunction = ref(null);

  const toggleLayer = () => {
    fileStore.scdStage = !fileStore.scdStage;
    isMainLayerVisible.value = !isMainLayerVisible.value;
    isFunctionLayerVisible.value = !isFunctionLayerVisible.value;

    if (onToggle) onToggle();
  };

  const showFunctionLayer = (func) => {
    fileStore.selectedFunction = func;
    selectedFunction.value = func;
    console.log("🔍 Selected function:", func);
    toggleLayer();
  };

  return {
    isMainLayerVisible,
    isFunctionLayerVisible,
    selectedFunction,
    toggleLayer,
    showFunctionLayer,
  };
}
