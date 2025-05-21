<template>
    <v-group :config="{ draggable: false }" @transformend="(e) => handleTransformEnd(e, i)">
        <v-text :config="textConfig" />
        <v-rect :config="rectConfig">
        </v-rect>

    </v-group>
</template>
<script setup>
import { onMounted, ref } from "vue";


const props = defineProps({
    x: Number,
    y: Number,
    dimensions:Object,
    name: String,
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 750 ,
    height: props.dimensions.height ,
    stroke: 'black',
    strokeWidth: 1.3,
    cornerRadius:5
})
const textConfig = ref({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 3,
    text: props.name,
    fontSize: 12,
})

onMounted(()=>{
    console.log(`x: ${props.dimensions.width}, y:${props.dimensions.height}`)
})


</script>

<style></style>