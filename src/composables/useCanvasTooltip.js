// src/composables/useCanvasTooltip.js
import { ref, computed } from 'vue';
import { measureTextWidth } from '@/utils/measureText';

// Konva shapes have no native DOM `title` attribute, so this renders a
// small floating label (background rect + text) near the pointer — the
// substitute every node component wires a truncatable text shape into.
export function useCanvasTooltip() {
  const visible = ref(false);
  const text = ref('');
  const pointerX = ref(0);
  const pointerY = ref(0);

  function showTooltip(fullText, x, y) {
    text.value = fullText;
    pointerX.value = x;
    pointerY.value = y;
    visible.value = true;
  }

  function hideTooltip() {
    visible.value = false;
  }

  const tooltipTextConfig = computed(() => ({
    x: pointerX.value + 12,
    y: pointerY.value + 12,
    text: text.value,
    fontSize: 12,
    fill: '#111827',
    padding: 4,
    listening: false,
  }));

  const tooltipRectConfig = computed(() => ({
    x: pointerX.value + 8,
    y: pointerY.value + 8,
    width: measureTextWidth(text.value, 12) + 16,
    height: 24,
    fill: '#FFFBEB',
    stroke: '#D1D5DB',
    strokeWidth: 1,
    cornerRadius: 4,
    listening: false,
  }));

  return { visible, showTooltip, hideTooltip, tooltipTextConfig, tooltipRectConfig };
}
