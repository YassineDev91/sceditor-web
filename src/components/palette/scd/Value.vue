<template>
    <v-group :config="groupConfig">
        <v-rect :config="rectConfig"></v-rect>
        <v-text :config="textConfig"></v-text>
    </v-group>
</template>
<script setup>
import { ref } from 'vue';


const props = defineProps({
    value: String,
    x: Number,
    y: Number,
})

const groupConfig = ref({
    x: props.x,
    y: props.y,
})

const rectConfig = ref({
    x: 5,
    y: 3,
    width: 140,
    height: 20,
    // fill color lighter than #FFF8E1
    fill: '#DBF1ED',
    stroke: '#9FD6CF',
    cornerRadius: 5,
    strokeWidth: 1,
})

const textConfig = ref({
    x: 15,
    y: 8,
    text: props.value.name,
    fontSize: 12,
    fill: '#000',
})

</script>