<template>
  <v-group :config="groupConfig">
    <v-rect :config="rectConfig" />
    <v-rect v-if="selected" :config="selectionRectConfig" />
    <v-text :config="titleConfig" />
    <v-image :config="iconConfig" />
    <Parameter v-for="(parameter, index) in props.parameters" :x="groupConfig.x * index" :y="groupConfig.y"
      :name="parameter.name" />
    <Statement v-for="(stmt, index) in props.statements" :key="stmt.id" :statement="stmt" :x="rectConfig.x"
      :y="rectConfig.y + (index * 30) + 30" fill="#FFFFE1" stroke="#FABB81"/>
      <v-image :config="iconConfig" />
  </v-group>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useImage } from 'vue-konva'
import Statement from './Statement.vue'
import Parameter from './Parameter.vue'
import { SPACING_UNIT, ICON_SIZE, CORNER_RADIUS, STROKE_WIDTH_NORMAL, STROKE_WIDTH_SELECTED } from '@/constants/nodeStyleTokens';
import { measureTextWidth } from '@/utils/measureText';

const NAME_X = SPACING_UNIT * 2 + ICON_SIZE + SPACING_UNIT; // 36
const MIN_WIDTH = 170;
const RIGHT_PADDING = SPACING_UNIT * 2; // 8

const props = defineProps({
  name: String,
  x: Number,
  y: Number,
  data: Object,
  statements: Array,
  selected: Boolean,
})

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Guard',
  draggable: true,
}))

const dynamicHeight = computed(() => {
  const baseHeight = 35;       // fixed top area
  const statementHeight = 30;  // height per statement
  return baseHeight + (props.statements?.length || 0) * statementHeight;
})

const dynamicWidth = computed(() => Math.max(MIN_WIDTH, NAME_X + measureTextWidth(props.name, 12) + RIGHT_PADDING));

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: dynamicWidth.value,
  height: dynamicHeight.value,
  fill: '#FFECD1',
  stroke: '#FABB81',
  cornerRadius: CORNER_RADIUS,
  strokeWidth: STROKE_WIDTH_NORMAL,
}))

const selectionRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: rectConfig.value.width,
  height: dynamicHeight.value,
  stroke: '#3498db',
  strokeWidth: STROKE_WIDTH_SELECTED,
  cornerRadius: CORNER_RADIUS,
}))

const titleConfig = computed(() => ({
  x: NAME_X,
  y: SPACING_UNIT * 2, // 8
  text: props.name || 'guard',
  fontSize: 12,
  fill: '#000',
}))

const [icon] = useImage('src/assets/icons/modifier.png')
const iconConfig = ref({
  x: SPACING_UNIT * 2, // 8
  y: SPACING_UNIT * 2, // 8
  width: ICON_SIZE,
  height: ICON_SIZE,
  image: icon,
})
</script>
