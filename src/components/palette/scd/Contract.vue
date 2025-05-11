<template>
    <v-group :config="{ draggable: false }" @transformend="(e) => handleTransformEnd(e, i)">
        <v-text :config="textConfig" />
        <v-rect :config="rectConfig">
        </v-rect>

    </v-group>
</template>
<script setup>
import { ref } from "vue";


const props = defineProps({
    x: Number,
    y: Number,
    name: String,
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: window.innerWidth ,
    height: window.innerHeight ,
    stroke: 'black',
    strokeWidth: 1,
})
const textConfig = ref({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 3,
    text: props.name,
    fontSize: 12,
})


</script>

<style></style>