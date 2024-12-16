<template>
    <v-group>
        <v-text :config="visibilityConfig"></v-text>
        <v-text :config="nameConfig"></v-text>
        <v-text :config="commaConfig"></v-text>
        <v-text :config="typeConfig"></v-text>
    </v-group>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    type: String,
    visibility: String
})


const visibilityConfig = ref({
    x: props.x,
    y: props.y,
    text: props.visibility,
    fontSize: 12,
})

const nameConfig = ref({
    x: visibilityConfig.value.x + visibilityConfig.value.fontSize*3,
    y: visibilityConfig.value.y,
    text: props.name,
    fontSize: 12,
})
const typeConfig = ref({
    x: nameConfig.value.x + nameConfig.value.fontSize*5,
    y: nameConfig.value.y,
    text: props.type,
    fontSize: 12,
})

const commaConfig = ref({
    x: nameConfig.value.x + nameConfig.value.fontSize*4,
    y: nameConfig.value.y,
    text: ":",
    fontSize: 12,
})
</script>

<style></style>