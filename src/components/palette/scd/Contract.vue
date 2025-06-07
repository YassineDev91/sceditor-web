<template>
    <v-group :config="groupConfig" @transformend="(e) => handleTransformEnd(e, i)">
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
const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: false,
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 700 ,
    height: props.dimensions.height || 500,
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
    console.log("🧩 Contract mounted!");
  console.log("📍 Group config:", groupConfig.value);
  console.log("📐 Rect config:", rectConfig.value);
  console.log("📝 Text config:", textConfig.value);
})


</script>

<style></style>