<template>
  <v-group :config="groupConfig">
    <v-rect :config="rectConfig" />
    <v-text :config="titleConfig" />
    <Value v-for="(value, index) in props.values" :key="index" :x="rectConfig.x" :y="rectConfig.y + (index * VALUE_ROW_HEIGHT) + VALUE_START_OFFSET"
      :value="value" />
    <v-rect v-if="selected" :config="selectionRectConfig" />
    <v-image :config="iconConfig" />
  </v-group>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useImage } from 'vue-konva'
import Value from './Value.vue'
import { SPACING_UNIT, ICON_SIZE, CORNER_RADIUS, STROKE_WIDTH_NORMAL, STROKE_WIDTH_SELECTED } from '@/constants/nodeStyleTokens'
import { measureTextWidth } from '@/utils/measureText'

const props = defineProps({
  name: String,
  values: Array,
  x: Number,
  y: Number,
  selected: Boolean,
  data: Object,
})

const NAME_X = SPACING_UNIT * 2 + ICON_SIZE + SPACING_UNIT; // 36
const MIN_WIDTH = 160;
const RIGHT_PADDING = SPACING_UNIT * 2; // 8
const VALUE_ROW_HEIGHT = SPACING_UNIT * 6; // 24
const VALUE_START_OFFSET = SPACING_UNIT * 7; // 28
const dynamicWidth = computed(() => Math.max(MIN_WIDTH, NAME_X + measureTextWidth(props.name, 12) + RIGHT_PADDING));

const calculateHeight = computed(() => {
  return props.values && props.values.length > 0
    ? VALUE_START_OFFSET + (props.values.length * VALUE_ROW_HEIGHT) + SPACING_UNIT * 2
    : 36; // minimum height when no values
});

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Enum',
  data: props.data,
  width: dynamicWidth.value,
  height: calculateHeight.value,
  draggable: true,
}))

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: groupConfig.value.width,
  height: calculateHeight.value,
  fill: '#E7F7F0',
  stroke: '#26A69A',
  cornerRadius: CORNER_RADIUS,
  strokeWidth: STROKE_WIDTH_NORMAL,
}))

const selectionRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: groupConfig.value.width,
  height: calculateHeight.value,
  stroke: '#3498db',
  strokeWidth: STROKE_WIDTH_SELECTED,
  cornerRadius: CORNER_RADIUS,
}))

const titleConfig = computed(() => ({
  x: NAME_X,
  y: SPACING_UNIT * 2, // 8
  text: props.name || 'Enum',
  fontSize: 12,
  fill: '#000',
}))

const [icon] = useImage('src/assets/icons/enum.png')
const iconConfig = ref({
  x: SPACING_UNIT * 2, // 8
  y: SPACING_UNIT * 2, // 8
  width: ICON_SIZE,
  height: ICON_SIZE,
  image: icon,
})
</script>
