<template>
    <v-group ref="groupRef" :config="groupConfig" @dragmove="e => emit('dragmove', e)">
        <v-rect ref="rectRef" :config="rectConfig">
        </v-rect>
        <v-text :config="textConfig" />
        <v-image :config="iconConfig" />
        <v-group :config="leftSideConfig">
            <v-rect :config="contentRectConfig1"></v-rect>
            <v-text :config="leftConfig" />
        </v-group>
        <v-group :config="rightSideConfig">
            <v-rect :config="contentRectConfig2"></v-rect>
            <v-text :config="rightConfig" />
        </v-group>

    </v-group>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useImage } from "vue-konva";
import AddStatement from "./AddStatement.vue";
const emit = defineEmits(['dragmove']);

const groupRef = ref({})
const rectRef = ref({})
const addStatementCmp = ref({})
const props = defineProps({
    x: Number,
    y: Number,
    statement: Object
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 130,
    stroke: 'black',
    cornerRadius: 5,
    fill: "#E7F4FE",
    stroke: "#84B2E9",
})
const textConfig = ref({
    x: rectConfig.value.x + 45,
    y: rectConfig.value.y + 17,
    text: "AssignmentStatement",
    fontSize: 15,
})

const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: true,
})



const contentRectConfig1 = ref({
    x: rectConfig.value.x,
    y: textConfig.value.y,
    height: 30,
    width: 140,
    stroke: "#84B2E9",
    strokeWidth: 0.5,
    fill: "#FEFDF8",
    cornerRadius: 5
})
const contentRectConfig2 = ref({
    x: contentRectConfig1.value.x,
    y: contentRectConfig1.value.y + 35,
    height: 30,
    width: 140,
    stroke: "#84B2E9",
    strokeWidth: 0.5,
    fill: "#FEFDF8",
    cornerRadius: 5
})
const leftConfig = ref({
    // x: contentRectConfig1.value.x + (contentRectConfig1.value.width - props.statement.expressions[0].left.name * 10) / 2,
    x: contentRectConfig1.value.x + (contentRectConfig1.value.width - props.statement.expressions[0].left.name.length * 8) / 2,
    y: contentRectConfig1.value.y + (contentRectConfig1.value.height - 15) / 2,
    text: "left: " + props.statement.expressions[0].left.name,
    fontSize: 14
})
const rightConfig = ref({
    x: contentRectConfig2.value.x + (contentRectConfig2.value.width - props.statement.expressions[0].right.value.length * 8) / 2,
    y: contentRectConfig2.value.y + (contentRectConfig2.value.height - 15) / 2,
    text: "right: " + props.statement.expressions[0].right.value,
    fontSize: 14
})

const leftSideConfig = ref({
    x: 40,
    y: 30,
})
const rightSideConfig = ref({
    x: leftSideConfig.value.x,
    y: leftSideConfig.value.y,

})
// const addStatementCoordinates = computed(() => ({
//     x: rectConfig.value.x + rectConfig.value.width/6 || 0,
//     y: rectConfig.value.y+rectConfig.value.height-40  || 0
// }))


const [image] = useImage("src/assets/icons/assignment_icon.png")
const iconConfig = ref({
    x: rectConfig.value.x + 10,
    y: rectConfig.value.y + 10,
    width: 30,
    height: 30,
    image: image
})
onMounted(() => {
    groupRef.value.getNode().width(rectRef.value.getNode().width())
    groupRef.value.getNode().height(rectRef.value.getNode().height())
    // console.log("NODE HEIGHT:", 2 + contentRectConfig2.value.height);

})
</script>

<style></style>