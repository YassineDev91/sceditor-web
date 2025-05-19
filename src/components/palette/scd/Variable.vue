<template>
    <v-group :config="{ draggable: true }">
        <v-rect :config="rectConfig">
        </v-rect>
        <v-text :config="textConfig" />
        <v-text :config="typeTextConfig" />
        <v-rect :config="selectionRectConfig" v-if="selected == true"></v-rect>
        <v-image :config="iconConfig"/>
    </v-group>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useImage } from "vue-konva";

const nameMarginX = 40
const nameMarginY = 13
const typeMarginX = nameMarginX
const typeMarginY = 27
const variableRectWidth = 160
const variableRectheight = 50


const props = defineProps({
    x: Number,
    y: Number,
    data: Object,
    selected: Boolean
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    fill: '#DBF1ED',
    stroke: '#9FD6CF',
    width: variableRectWidth,
    height: variableRectheight,
    cornerRadius: 5,
    strokeWidth: 1,

})
const selectionRectConfig = ref({
    x: props.x,
    y: props.y,
    width: rectConfig.value.width,
    height: rectConfig.value.height,
    cornerRadius: 5,
    stroke: '#73C7C7',
    strokeWidth: 2,
})
const textConfig = ref({
    // x: rectConfig.value.x - props.name.length * 2.5,
    // y: rectConfig.value.y - rectConfig.value.radiusY / 4,

    x: props.x + nameMarginX,
    y: props.y + nameMarginY,
    text: props.data.name,
    fontSize: 12,
    data: props.data
})
const typeTextConfig = ref({
    x: props.x + typeMarginX,
    y: props.y + typeMarginY,
    text:  props.data.type.payable ? props.data.type.base+' payable':props.data.type.base,
    fill: 'gray',
    fontSize: 12,
    data: props.data.type.base
})
const [image] = useImage("src/assets/icons/variable_icon.png")
const iconConfig = ref({
    x:props.x+5,
    y:props.y+10,
    image:image,
    width:30,
    height:30
})

onMounted(() => {
    // console.log("Variable mounted", props.data.name.length)
})


</script>

<style></style>