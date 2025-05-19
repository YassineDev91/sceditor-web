<template>
    <v-group>
        <v-rect :config="rectConfig"></v-rect>
        <v-text :config="textConfig"></v-text>
    </v-group>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
    coordinates: Object
})
const rectConfig = ref({
    x: props.coordinates.x,
    y: props.coordinates.y,
    cornerRadius: 5,
    height: 30,
    width: 140,
    fill: "#FEFDF8",
    stroke: "#CDD1D5"
})
const textConfig = ref({
    x: rectConfig.value.x + 10,
    y: rectConfig.value.y + 8,
    text: "+ Add Statement",
    fontSize: 15,
    fill: "#626868"
})

</script>