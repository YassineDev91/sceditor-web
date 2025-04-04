<template>
    <v-group>
        <v-rect :config="rectConfig"></v-rect>
        <v-text :config="textConfig"></v-text>
    </v-group>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
    x: Number,
    y: Number,
    name: String
})
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 70,
    height: 20,
    stroke: 'black',
    strokeWidth: 1,
    fill: '#1dd1a1'
})
const textConfig = ref({
    x: props.x + 5,
    y: props.y + 5,
    fontSize: 12,
    text: props.name
})
</script>

<style></style>