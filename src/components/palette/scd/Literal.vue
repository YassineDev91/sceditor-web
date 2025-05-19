<template>
    <v-group>
        <v-rect ref="textRectRef" :config="textRectConfig"></v-rect>
        <!-- <v-text ref="textRectRef" :config="visibilityConfig"></v-text> -->
        <v-text ref="literalTextRef" :config="nameConfig"></v-text>
        <!-- <v-text :config="commaConfig"></v-text>
        <v-text :config="typeConfig"></v-text> -->
    </v-group>
</template>

<script setup>
import { onMounted, ref } from "vue";
var textRectRef = ref({})
var literalTextRef = ref({})

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    data: Object,
    visibility: String
})
const textRectConfig = ref({
    x: props.x,
    y: props.y,
    width: 100,
    height: 20,
    cornerRadius: 10,
    fill: '#F7F5FE',
    stroke: '#CCC7F6',
})
const visibilityConfig = ref({
    x: props.x,
    y: props.y + 5,
    text: props.visibility,
    fontSize: 12,
})

const nameConfig = ref({
    x: textRectConfig.value.x + 30,
    y: textRectConfig.value.y + 5,
    text: props.name,
    fontSize: 12,
})
// const typeConfig = ref({
//     x: nameConfig.value.x + nameConfig.value.fontSize*5,
//     y: nameConfig.value.y,
//     text: props.type,
//     fontSize: 12,
// })

// const commaConfig = ref({
//     x: nameConfig.value.x + nameConfig.value.fontSize*4,
//     y: nameConfig.value.y,
//     text: ":",
//     fontSize: 12,
// })
onMounted(() => {
  

})
</script>

<style></style>