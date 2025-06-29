<template>
    <v-group :config="groupConfig" @click="e => emit('click', e)" @dragend="e => emit('dragend', e)">
        <v-rect v-if="isHovered" :config="hoverRectConfig" />
        <v-rect :config="rectConfig">
        </v-rect>
        <v-text :config="textConfig" />
        <v-text :config="typeTextConfig" />
        <v-rect :config="selectionRectConfig" v-if="selected == true"></v-rect>
        <v-image :config="iconConfig" />
    </v-group>
</template>
<script setup>
import { useContractStorage } from "@/stores/contract";
import { data } from "autoprefixer";
import { computed, onMounted, ref } from "vue";
import { useImage } from "vue-konva";

const emit = defineEmits(['click', 'dragend']);

const fileStore = useContractStorage();


const nameMarginX = 35
const nameMarginY = 5
const typeMarginX = nameMarginX
const typeMarginY = 20
const variableRectWidth = 120
const variableRectheight = 35
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
    width: variableRectWidth,
    height: variableRectheight,
    cornerRadius: 5,
    strokeWidth: 1,

}))
const selectionRectConfig = computed(() => ({
    width: rectConfig.value.width,
    height: rectConfig.value.height,
    cornerRadius: 5,
    stroke: '#3498db',
    strokeWidth: 2,
}))
const textConfig = computed(() => ({

    x: nameMarginX,
    y: nameMarginY,

    text: props.data.name,
    fontSize: 12,
    data: props.data
}))

const typeTextConfig = computed(() => ({
    x: typeMarginX,
    y: typeMarginY,
    text: props.data.type.payable ? props.data.type.base + ' payable' : props.data.type.base,
    fill: 'gray',
    fontSize: 12,
    data: props.data.type.base
}))
const [image] = useImage("src/assets/icons/variable.svg")
const iconConfig = ref({
    x: 5,
    y: 5,
    image: image,
    width: 25,
    height: 25
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
    cornerRadius: 5
}));

onMounted(() => {
    // console.log("Variable mounted", props.data.name.length)
})

function handleClick() {
    console.log("✅ Clicked struct with data:", props.data);
    console.log('🧪 props.data.type =', props.data?.cmp_type)
    fileStore.showProperties(props.data);
}


</script>

<style></style>