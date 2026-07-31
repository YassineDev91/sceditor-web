<template>
    <v-group :config="groupConfig" @click="e => emit('click', e)" @dragend="e => emit('dragend', e)">
        <v-rect v-if="isHovered" :config="hoverRectConfig" />
        <v-rect :config="rectConfig">
        </v-rect>
        <v-text :config="textConfig" />
        <v-text :config="typeTextConfig" @mouseenter="handleTypeMouseEnter" @mouseleave="canvasTooltip.hideTooltip()" />
        <v-rect :config="selectionRectConfig" v-if="selected == true"></v-rect>
        <v-image :config="iconConfig" />
    </v-group>
</template>
<script setup>
import { useContractStorage } from "@/stores/contract";
import { formatTypeNode } from '@/schema/typeFormat'
import { computed, inject, ref } from "vue";
import { useImage } from "vue-konva";
import { SPACING_UNIT, ICON_SIZE, CORNER_RADIUS, STROKE_WIDTH_NORMAL, STROKE_WIDTH_SELECTED } from '@/constants/nodeStyleTokens';
import { measureTextWidth } from '@/utils/measureText';

const canvasTooltip = inject('canvasTooltip');

const emit = defineEmits(['click', 'dragend']);

const fileStore = useContractStorage();


const ICON_X = SPACING_UNIT * 2;               // 8
const ICON_Y = SPACING_UNIT * 2;                // 8
const nameMarginX = ICON_X + ICON_SIZE + SPACING_UNIT; // 36
const nameMarginY = SPACING_UNIT * 2;           // 8
const typeMarginX = nameMarginX;                // 36
const typeMarginY = nameMarginY + SPACING_UNIT * 4; // 24
const MIN_RECT_WIDTH = 120;
const RIGHT_PADDING = SPACING_UNIT * 2;         // 8
const variableRectheight = 40;
const isHovered = ref(false)


const groupConfig = computed(() => ({
    x: props.x,
    y: props.y,
    data: props.data,
    draggable: true,
}));

const props = defineProps({
    x: Number,
    y: Number,
    data: Object,
    selected: Boolean
});
const rectConfig = computed(() => ({
    fill: '#DBF1ED',
    stroke: '#9FD6CF',
    width: Math.max(MIN_RECT_WIDTH, nameMarginX + measureTextWidth(props.data.name, 12) + RIGHT_PADDING),
    height: variableRectheight,
    cornerRadius: CORNER_RADIUS,
    strokeWidth: STROKE_WIDTH_NORMAL,
}))
const selectionRectConfig = computed(() => ({
    width: rectConfig.value.width,
    height: rectConfig.value.height,
    cornerRadius: CORNER_RADIUS,
    stroke: '#3498db',
    strokeWidth: STROKE_WIDTH_SELECTED,
}))
const textConfig = computed(() => ({
    x: nameMarginX,
    y: nameMarginY,
    text: props.data.name,
    fontSize: 12,
    data: props.data
}))

const typeText = computed(() =>
  formatTypeNode(props.data.type, {
    resolveRef: (id) =>
      fileStore.contract.structs.find(s => s.id === id)?.name ||
      fileStore.contract.enums.find(e => e.id === id)?.name ||
      id,
  })
)

const typeTextConfig = computed(() => ({
    x: typeMarginX,
    y: typeMarginY,
    text: typeText.value,
    fill: 'gray',
    fontSize: 12,
    width: rectConfig.value.width - typeMarginX - RIGHT_PADDING,
    wrap: 'none',
    ellipsis: true,
}))

function handleTypeMouseEnter(e) {
  const pos = e.target.getStage().getRelativePointerPosition();
  canvasTooltip.showTooltip(typeText.value, pos.x, pos.y);
}
const [image] = useImage("src/assets/icons/variable.svg")
const iconConfig = ref({
    x: ICON_X,
    y: ICON_Y,
    image: image,
    width: ICON_SIZE,
    height: ICON_SIZE
})

const hoverRectConfig = computed(() => ({
    x: rectConfig.value.x - 1,
    y: rectConfig.value.y - 1,
    width: rectConfig.value.width + 2,
    height: rectConfig.value.height + 2,
    stroke: '#3b82f6',
    strokeWidth: 2,
    dash: [4, 2],
    listening: false,  // prevent this rect from capturing mouse events
    cornerRadius: CORNER_RADIUS
}));



</script>

<style></style>