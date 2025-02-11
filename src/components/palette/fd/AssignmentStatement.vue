<template>
    <v-group :config="{ draggable: true }">
        <v-text :config="textConfig" />
        <v-line :config="lineConfig" />
        <v-rect :config="rectConfig">
        </v-rect>
        <v-text :config="leftConfig" />
        <v-text :config="rightConfig" />
    </v-group>
</template>
<script setup>
import { ref } from "vue";
import Literal from '@/components/palette/scd/Literal.vue'

const props = defineProps({
    x: Number,
    y: Number,
    expressions: Object
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 100,
    stroke: 'black',
    strokeWidth: 1,
})
const textConfig = ref({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 3,
    text: "AssignmentStatement",
    fontSize: 12,
})
const lineConfig = ref({
    points: [rectConfig.value.x, rectConfig.value.y + textConfig.value.fontSize + 5, rectConfig.value.x + rectConfig.value.width, rectConfig.value.y + textConfig.value.fontSize + 5],
    stroke: 'black',
    strokeWidth: 1,
})
const leftConfig = ref({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 20,
    text: "left: " + props.expressions.left,
    fontSize: 12
})
const rightConfig = ref({
    x: rectConfig.value.x + 3,
    y: leftConfig.value.y + 15,
    text: "right:" + props.expressions.right,
    fontSize: 12
})
</script>

<style></style>