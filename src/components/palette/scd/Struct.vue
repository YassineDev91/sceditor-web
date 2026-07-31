<template>
  <v-group :config="groupConfig">
    <v-rect :config="rectConfig" />
    <v-rect v-if="selected" :config="selectionRectConfig" />
    <Literal
      v-for="(literal, index) in props.literals"
      :key="literal.id"
      :visibility="literal.visibility"
      :name="literal.name"
      :data="literal"
      :x="LITERAL_X"
      :y="LITERAL_START_Y + (index * LITERAL_ROW_HEIGHT)"
    />
    <v-text :config="textConfig" />
    <v-image :config="iconConfig" />
  </v-group>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import Literal from './Literal.vue';
import { useImage } from 'vue-konva';
import { SPACING_UNIT, ICON_SIZE, CORNER_RADIUS, STROKE_WIDTH_NORMAL, STROKE_WIDTH_SELECTED } from '@/constants/nodeStyleTokens';
import { measureTextWidth } from '@/utils/measureText';

const ICON_X = SPACING_UNIT * 2;                       // 8
const ICON_Y = SPACING_UNIT * 2;                        // 8
const TITLE_X = ICON_X + ICON_SIZE + SPACING_UNIT;      // 36
const TITLE_Y = SPACING_UNIT * 2;                       // 8
const LITERAL_X = SPACING_UNIT * 2;                     // 8
const LITERAL_START_Y = SPACING_UNIT * 10;              // 40
const LITERAL_ROW_HEIGHT = SPACING_UNIT * 6;            // 24
const BOTTOM_PADDING = SPACING_UNIT * 2;                // 8
const RIGHT_PADDING = SPACING_UNIT * 2;                 // 8
const LITERAL_WIDTH = 130;                              // matches Literal.vue's own box width
const MIN_STRUCT_WIDTH = LITERAL_X + LITERAL_WIDTH + RIGHT_PADDING; // 146

const props = defineProps({
  x: Number,
  y: Number,
  name: String,
  literals: Array,
  data: Object,
  selected: Boolean
});

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Struct',
  width: rectConfig.value.width,
  height: rectConfig.value.height,
  draggable: true
}));

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: Math.max(MIN_STRUCT_WIDTH, TITLE_X + measureTextWidth(props.name, 12) + RIGHT_PADDING),
  height: LITERAL_START_Y + (props.literals?.length || 0) * LITERAL_ROW_HEIGHT + BOTTOM_PADDING,
  fill: '#E9E5FD',
  cornerRadius: CORNER_RADIUS,
  stroke: '#9673A6',
  strokeWidth: STROKE_WIDTH_NORMAL
}));

const selectionRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: rectConfig.value.width,
  height: rectConfig.value.height,
  stroke: '#3498db',
  cornerRadius: CORNER_RADIUS,
  strokeWidth: STROKE_WIDTH_SELECTED
}));

const textConfig = computed(() => ({
  x: TITLE_X,
  y: TITLE_Y,
  text: props.name,
  fontSize: 12,
  fill: '#000'
}));

const [image] = useImage('src/assets/icons/struct_icon.png');
const iconConfig = ref({
  x: ICON_X,
  y: ICON_Y,
  width: ICON_SIZE,
  height: ICON_SIZE,
  image: image
});
</script>