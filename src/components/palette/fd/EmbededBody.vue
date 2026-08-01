<template>
    <v-group ref="groupRef" :config="groupConfig" @dragmove="e => emit('dragmove', e)">
        <v-rect ref="rectRef" :config="rectConfig">
        </v-rect>
        <v-text :config="contentRectConfig"></v-text>
        <EmbededStatementRenderer v-for="(stmt, index) in props.statements" :statement="stmt" :x="props.x + 10"
            :y="props.y + (index * 30)" :key="stmt.id" />
        <AddStatement ref="addStatementCmp" :coordinates="{ x: props.x + 30, y: props.y + 100 }"></AddStatement>
    </v-group>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useImage } from "vue-konva";
import AddStatement from "./AddStatement.vue";
import EmbededStatementRenderer from "./EmbededStatementRenderer.vue";
const emit = defineEmits(['dragmove']);

const groupRef = ref({})
const rectRef = ref({})
const addStatementCmp = ref({})
const props = defineProps({
    x: Number,
    y: Number,
    width: Number,
    statements: Array
});

const contentRectConfig = ref({
    x: props.x + 5,
    y: props.y + 5,
    height: 10,
    width: props.width,
    fill: "Black",
    text: "Body",
    fontSize: 14
})
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: props.width,
    height: 30,
    stroke: 'black',
    cornerRadius: 5,
    fill: "#FEFDF8",
    stroke: "#CDD1D5",
    strokeWidth: 0.5
})

const groupConfig = ref({
    x: props.x,
    y: props.y,
})


const [image] = useImage("src/assets/icons/git.png")
const iconConfig = ref({
    x: rectConfig.value.x + 5,
    y: rectConfig.value.y + 5,
    width: 20,
    height: 20,
    image: image
})
onMounted(() => {
    rectRef.value.getNode().height(rectRef.value.getNode().height() + props.statements?.length * 30 + 20);
})
</script>

<style></style>