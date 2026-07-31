<template>
    <v-group @mouseenter="handleMouseEnter" @mouseleave="canvasTooltip.hideTooltip()">
        <v-rect :config="rectConfig"></v-rect>
        <v-text :config="textConfig"></v-text>
    </v-group>
</template>
<script setup>
import { computed, inject } from 'vue';
import { CORNER_RADIUS, STROKE_WIDTH_NORMAL } from '@/constants/nodeStyleTokens';

const props = defineProps({
    config: {
        x: Number,
        y: Number,
        height: Number,
        width: Number,
        content: String,
        fillColor: String,
        borderColor: String,
        fontSize: Number
    }
})

const canvasTooltip = inject('canvasTooltip');

const rectConfig = computed(() => ({
    x: props.config.x,
    y: props.config.y,
    height: props.config.height,
    width: props.config.width,
    fill: props.config.fillColor,
    stroke: props.config.borderColor,
    strokeWidth: STROKE_WIDTH_NORMAL,
    cornerRadius: CORNER_RADIUS,
}))

const textConfig = computed(() => ({
    x: rectConfig.value.x,
    y: rectConfig.value.y + (rectConfig.value.height - props.config.fontSize) / 2,
    width: rectConfig.value.width,
    align: 'center',
    text: props.config.content,
    fill: 'black',
    fontSize: props.config.fontSize,
    wrap: 'none',
    ellipsis: true,
}))

function handleMouseEnter(e) {
  const pos = e.target.getStage().getRelativePointerPosition();
  canvasTooltip.showTooltip(props.config.content, pos.x, pos.y);
}
</script>
