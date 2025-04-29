<template>
    <v-group :config="{ draggable: true }">
        <v-ellipse :config="ellipseConfig">
        </v-ellipse>
        <v-text :config="textConfig" />
        <v-ellipse :config="selectionEllipseConfig" v-if="selected == true"></v-ellipse>
    </v-group>
</template>
<script setup>
import { ref } from "vue";


const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    data:Object,
    selected:Boolean
});
const ellipseConfig = ref({
    x: props.x,
    y: props.y,
    radiusX: 50,
    radiusY: 20,
    fill: '#ff9ff3',
    stroke: 'black',
    strokeWidth: 1,
})
const selectionEllipseConfig = ref({
    x: props.x,
    y: props.y,
    radiusX: 50,
    radiusY: 20,
    stroke: '#3498db',
    strokeWidth: 2,
})
const textConfig = ref({
    x: ellipseConfig.value.x - props.name.length * 2.5,
    y: ellipseConfig.value.y - ellipseConfig.value.radiusY / 4,
    text: props.data.name,
    fontSize: 12,
    data:props.data
})

</script>   

<style></style>