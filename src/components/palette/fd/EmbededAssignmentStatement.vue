<template>
    <v-group ref="groupRef" :config="groupConfig" @dragmove="e => emit('dragmove', e)">
        <v-rect ref="rectRef" :config="rectConfig">
        </v-rect>
        <v-image :config="iconConfig" />
        <ContentRectangle :config="contentRectConfig"></ContentRectangle>

    </v-group>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useImage } from "vue-konva";
import ContentRectangle from "./ContentRectangle.vue";
const emit = defineEmits(['dragmove']);

const groupRef = ref({})
const rectRef = ref({})

const props = defineProps({
    x: Number,
    y: Number,
    statement: Object
});

const contentRectConfig = ref({
    x: props.x + 10,
    y: props.y,
    height: 10,
    width: 100,
    fill: "#FEFDF8",
    borderColor: "",
    content: props.statement?.expressions != null ? props.statement?.expressions[0].left?.name + " = " + props.statement.expressions[0]?.right?.value : "",
    fontSize: 14
})
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: contentRectConfig.value.content.length * 20,
    height: 30,
    stroke: 'black',
    cornerRadius: 5,
    fill: "#E7F4FE",
    stroke: "#84B2E9",
    strokeWidth: 0.5
})

const groupConfig = ref({
    x: props.x,
    y: props.y,
})


const [image] = useImage("src/assets/icons/assignment_icon.png")
const iconConfig = ref({
    x: rectConfig.value.x + 5,
    y: rectConfig.value.y + 5,
    width: 20,
    height: 20,
    image: image
})
onMounted(() => {
    // console.log("NODE HEIGHT:", 2 + contentRectConfig2.value.height);
    // console.log("EmbededAssignmentStatement mounted", props.statement.expressions[0].left.name, props.statement.expressions[0].right.value);
    // contentRectConfig.value.content = props.statement.expressions[0].left.name + " = "+ props.statement.expressions[0].right.value;
})
</script>

<style></style>