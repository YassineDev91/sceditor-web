<template>
    <v-group :config="{ draggable: true }">
        <!-- <v-line :config="lineConfig" /> -->
        <v-rect :config="rectConfig">
        </v-rect>
        <v-rect :config="selectionRectConfig" v-if="selected">
        </v-rect>
        <Literal v-for="(literal, index) in props.literals" :key="literal.id" :visibility="literal.visibility"
            :name="literal.name" :data="literal" :x="rectConfig.x + 10" :y="rectConfig.y + (index * 25) + 35">
        </Literal>
        <v-text :config="textConfig" />
        <v-image :config="iconConfig"/>

    </v-group>
</template>
<script setup>
import { ref } from "vue";
import Literal from './Literal.vue'
import { useImage } from "vue-konva";

const nameMarginX = 60
const nameMarginY = 10
const typeMarginX = nameMarginX
const typeMarginY = 27
const variableRectWidth = 160
const variableRectheight = 50

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    literals: Array,
    data: Object,
    selected: Boolean
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 150,
    height: 140,
    fill:"#E9E5FD",
    cornerRadius:5,
    stroke: '#9673A6',
    strokeWidth: 1,
})
const selectionRectConfig = ref({
    x: props.x,
    y: props.y,
    width: rectConfig.value.width,
    height: rectConfig.value.height,
    stroke: '#3498db',
    cornerRadius:5,
    strokeWidth: 2,
})
const textConfig = ref({
    x: rectConfig.value.x + nameMarginX,
    y: rectConfig.value.y + nameMarginY,
    text: props.data.name,
    fontSize: 12,
    data: props.data
})
const [image] = useImage("src/assets/icons/struct_icon.png")

const iconConfig = ref({
    x:rectConfig.value.x + 30,
    y:rectConfig.value.y + 5,
    width:20,
    height:20,
    image:image
})
// const lineConfig = ref({
//     points: [rectConfig.value.x, rectConfig.value.y + textConfig.value.fontSize + 5, rectConfig.value.x + rectConfig.value.width, rectConfig.value.y + textConfig.value.fontSize + 5],
//     stroke: 'black',
//     strokeWidth: 1,
// }
// )
</script>

<style></style>