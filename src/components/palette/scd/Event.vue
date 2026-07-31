<template>
  <v-group :config="groupConfig" @click="e => emit('click', e)"
  @dragend="e => emit('dragend', e)">
    <v-rect :config="rectConfig" />
    <v-text :config="prefixConfig" />
    <v-text :config="paramsConfig" @mouseenter="handleParamsMouseEnter" @mouseleave="canvasTooltip.hideTooltip()" />
    <v-text :config="closingConfig" />
    <v-image :config="iconConfig" />
    <v-rect :config="selectionConfig" v-if="props.data.isSelected" />
  </v-group>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useImage } from 'vue-konva'
import { formatTypeNode } from '@/schema/typeFormat'
import { SPACING_UNIT, ICON_SIZE, CORNER_RADIUS, STROKE_WIDTH_NORMAL, STROKE_WIDTH_SELECTED } from '@/constants/nodeStyleTokens';
import { measureTextWidth } from '@/utils/measureText';

const canvasTooltip = inject('canvasTooltip');

const NAME_X = SPACING_UNIT * 2 + ICON_SIZE + SPACING_UNIT; // 36
const PARAMS_FIELD_WIDTH = 100;
const GAP = SPACING_UNIT; // 4
const KEYWORD = 'event';

const emit = defineEmits(['click', 'dragend'])
const props = defineProps({
  name: String,
  x: Number,
  y: Number,
  data: Object,
})

const paramTypesText = computed(() =>
  (props.data.parameters || []).map(p => formatTypeNode(p.type)).join(', ')
)

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Event',
  draggable: true,
}))

const prefixText = computed(() => `${KEYWORD} ${props.name}(`);

const prefixConfig = computed(() => ({
  x: NAME_X,
  y: SPACING_UNIT * 4, // 16
  text: prefixText.value,
  fontSize: 12,
  fill: '#000',
}));

const paramsWidth = computed(() => Math.min(PARAMS_FIELD_WIDTH, measureTextWidth(paramTypesText.value, 12)));

const paramsConfig = computed(() => ({
  x: NAME_X + measureTextWidth(prefixText.value, 12) + GAP,
  y: SPACING_UNIT * 4,
  text: paramTypesText.value,
  fontSize: 12,
  fill: '#6b7280',
  width: paramsWidth.value,
  wrap: 'none',
  ellipsis: true,
}));

const closingConfig = computed(() => ({
  x: paramsConfig.value.x + paramsWidth.value + GAP,
  y: SPACING_UNIT * 4,
  text: ');',
  fontSize: 12,
  fill: '#000',
}));

const contentWidth = computed(() => closingConfig.value.x + measureTextWidth(');', 12) + SPACING_UNIT * 2);

function handleParamsMouseEnter(e) {
  const pos = e.target.getStage().getRelativePointerPosition();
  canvasTooltip.showTooltip(paramTypesText.value, pos.x, pos.y);
}

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: contentWidth.value,
  height: 40,
  fill: '#E3F2FD',
  stroke: '#64B5F6',
  cornerRadius: CORNER_RADIUS,
  strokeWidth: STROKE_WIDTH_NORMAL,
}))

const selectionConfig = computed(() => ({
  width: rectConfig.value.width,
  height: rectConfig.value.height,
  stroke: '#3498db',
  cornerRadius: CORNER_RADIUS,
  strokeWidth: STROKE_WIDTH_SELECTED,
}))

const [image] = useImage("src/assets/icons/emit.png")
const iconConfig = ref({
  x: SPACING_UNIT * 2, // 8
  y: SPACING_UNIT * 2, // 8
  image: image,
  width: ICON_SIZE,
  height: ICON_SIZE,
})
</script>
