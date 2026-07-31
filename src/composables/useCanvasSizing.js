import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useContractStorage } from '@/stores/contract';

export function useCanvasSizing(workspaceRef, stageRef) {
  const fileStore = useContractStorage();

  const widthCanvaRef = ref(0);
  const heightCanvaRef = ref(0);
  const canvasReady = ref(false);

  const stageConfig = computed(() => ({
    width: widthCanvaRef.value - widthCanvaRef.value * 0.1, // 10% padding
    height: heightCanvaRef.value - heightCanvaRef.value * 0.1, // 10% padding
  }));

  const initializeSize = async () => {
    await nextTick(); // Wait for DOM
    const workspace = workspaceRef.value;
    if (workspace) {
      widthCanvaRef.value = workspace.offsetWidth;
      heightCanvaRef.value = window.innerHeight;

      await nextTick();
      const workspace2 = workspaceRef.value;
      if (workspace2) {
        widthCanvaRef.value = workspace2.offsetWidth;
        heightCanvaRef.value = window.innerHeight;
        canvasReady.value = true;

        nextTick(() => {
          const stage = stageRef.value?.getNode();
          if (stage) {
            stage.setSize({ width: widthCanvaRef.value, height: heightCanvaRef.value });
            stage.draw();
          }
        });
      }
    }
  };

  const RESIZE_DEBOUNCE_MS = 200;
  let resizeTimeoutId = null;

  const handleWindowResize = () => {
    if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
    resizeTimeoutId = setTimeout(() => {
      initializeSize();
    }, RESIZE_DEBOUNCE_MS);
  };

  onMounted(() => {
    initializeSize();
    window.addEventListener('resize', handleWindowResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
    if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
  });

  watch(
    () => fileStore.contract.name,
    async (newVal) => {
      if (newVal) {
        await nextTick(); // Wait for DOM
        const workspace = workspaceRef.value;
        if (workspace) {
          widthCanvaRef.value = workspace.offsetWidth;
          heightCanvaRef.value = workspace.offsetHeight;

          nextTick(() => {
            const stage = stageRef.value?.getNode();
            if (stage) {
              stage.setSize({ width: widthCanvaRef.value, height: heightCanvaRef.value });
              stage.batchDraw();
              console.log("✅ Stage resized after contract creation",
                widthCanvaRef.value, heightCanvaRef.value);
            }
          });
        }
      }
    }
  );

  return { widthCanvaRef, heightCanvaRef, canvasReady, stageConfig, initializeSize };
}
